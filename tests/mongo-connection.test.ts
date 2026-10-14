import { describe, expect, mock, test } from 'bun:test';
import { EventEmitter } from 'node:events';
import { createApp, createError, defineEventHandler, toWebHandler } from 'h3';
import { createMongoConnectionManager, MONGO_CONNECT_OPTIONS } from '../server/utils/mongoConnection';
import { mongoErrorDetails } from '../server/utils/mongoDiagnostics';

const uri = 'mongodb+srv://private-user:private%40password@cluster.example/catalog';

function fixture() {
  const events = new EventEmitter();
  const connection = {
    readyState: 0,
    on: (event: string, listener: (...args: unknown[]) => void) => events.on(event, listener)
  };
  const connect = mock(async () => {
    connection.readyState = 1;
    events.emit('connected');
  });
  const disconnect = mock(async () => {
    connection.readyState = 0;
  });
  const probe = mock(async () => {
    connection.readyState = 1;
  });
  const entries: Record<string, unknown>[] = [];
  const manager = createMongoConnectionManager({
    client: { connection, connect, disconnect, probe },
    getUri: () => uri,
    log: (_level, entry) => entries.push(entry),
    pause: async () => {}
  });
  return { manager, connection, connect, disconnect, probe, events, entries };
}

function networkError() {
  return Object.assign(new Error(`Unable to connect to ${uri}`), { name: 'MongooseServerSelectionError' });
}

describe('MongoDB readiness and recovery', () => {
  test('shares one awaited connection between concurrent requests and reuses it', async () => {
    const f = fixture();
    let resolve!: () => void;
    f.connect.mockImplementationOnce(() => new Promise<void>((done) => {
      resolve = () => {
        f.connection.readyState = 1;
        done();
      };
    }));
    let completed = 0;
    const requests = Array.from({ length: 20 }, () => f.manager.ensureConnected().then(() => completed++));
    expect(f.connect).toHaveBeenCalledTimes(1);
    expect(completed).toBe(0);
    resolve();
    await Promise.all(requests);
    await f.manager.ensureConnected();
    expect(completed).toBe(20);
    expect(f.connect).toHaveBeenCalledTimes(1);
    expect(f.entries.filter(entry => entry.event === 'connection_ready')).toHaveLength(1);
    expect(MONGO_CONNECT_OPTIONS).toMatchObject({ serverSelectionTimeoutMS: 5000, maxPoolSize: 10, bufferCommands: false });
  });

  test('retries a failed initial connection and releases the failed client', async () => {
    const f = fixture();
    f.connect.mockRejectedValueOnce(networkError());
    await f.manager.ensureConnected();
    expect(f.connect).toHaveBeenCalledTimes(2);
    expect(f.disconnect).toHaveBeenCalledTimes(1);
    expect(f.entries.filter(entry => entry.event === 'connection_failed')).toHaveLength(1);
  });

  test('clears an exhausted attempt so later requests can recover', async () => {
    const f = fixture();
    f.connect.mockRejectedValueOnce(networkError()).mockRejectedValueOnce(networkError());
    await expect(f.manager.ensureConnected()).rejects.toThrow('Database unavailable');
    await f.manager.ensureConnected();
    expect(f.connect).toHaveBeenCalledTimes(3);
    expect(f.disconnect).toHaveBeenCalledTimes(2);
  });

  test('probes an established disconnected pool without creating another pool', async () => {
    const f = fixture();
    await f.manager.ensureConnected();
    f.connection.readyState = 0;
    f.events.emit('disconnected');
    f.probe.mockRejectedValueOnce(networkError());
    await expect(f.manager.ensureConnected()).rejects.toThrow('Database unavailable');
    await f.manager.ensureConnected();
    expect(f.probe).toHaveBeenCalledTimes(2);
    expect(f.connect).toHaveBeenCalledTimes(1);
    expect(f.disconnect).not.toHaveBeenCalled();
    expect(f.entries.some(entry => entry.event === 'recovery_failed')).toBe(true);
    expect(f.entries.some(entry => entry.event === 'connection_recovered')).toBe(true);
  });

  test('returns a safe HTTP 503 before the operation and includes request correlation', async () => {
    const f = fixture();
    f.connect.mockRejectedValue(networkError());
    const operation = mock(async () => 'should not run');
    const handle = toWebHandler(createApp().use(defineEventHandler(event => f.manager.run(event, 'devices.create', operation))));
    const response = await handle(new Request('https://example.com/api/devices', {
      headers: { 'x-vercel-id': 'gru1::iad1::request-123' }
    }));
    expect(response.status).toBe(503);
    expect(response.headers.get('retry-after')).toBe('5');
    expect(await response.text()).not.toContain('private');
    expect(operation).not.toHaveBeenCalled();
    expect(f.entries.at(-1)).toMatchObject({ event: 'operation_unavailable', operation: 'devices.create', requestId: 'gru1::iad1::request-123' });
    expect(JSON.stringify(f.entries)).not.toContain('private');
  });

  test('does not replay a write that fails after readiness', async () => {
    const f = fixture();
    const operation = mock(async () => {
      throw networkError();
    });
    const handle = toWebHandler(createApp().use(defineEventHandler(event => f.manager.run(event, 'devices.create', operation))));
    expect((await handle(new Request('https://example.com/api/devices'))).status).toBe(503);
    expect(operation).toHaveBeenCalledTimes(1);
    expect(f.entries.at(-1)).toMatchObject({ event: 'operation_unavailable' });
  });

  test('preserves application errors and genuine empty query results', async () => {
    const f = fixture();
    const empty = toWebHandler(createApp().use(defineEventHandler(event => f.manager.run(event, 'devices.list', async () => []))));
    expect(await (await empty(new Request('https://example.com'))).json()).toEqual([]);
    const conflict = createError({ statusCode: 409, statusMessage: 'Conflict' });
    const handle = toWebHandler(createApp().use(defineEventHandler(event => f.manager.run(event, 'devices.create', async () => {
      throw conflict;
    }))));
    expect((await handle(new Request('https://example.com'))).status).toBe(409);
    expect(f.entries.some(entry => entry.event === 'operation_unavailable')).toBe(false);
  });

  test('reports missing configuration without connecting', async () => {
    const f = fixture();
    const manager = createMongoConnectionManager({
      client: f, getUri: () => '', log: (_level, entry) => f.entries.push(entry)
    });
    await expect(manager.ensureConnected()).rejects.toThrow('Database unavailable');
    expect(f.connect).not.toHaveBeenCalled();
    expect(f.entries.at(-1)).toMatchObject({ event: 'configuration_missing' });
  });
});

describe('MongoDB diagnostic redaction', () => {
  test('retains per-server DNS, TLS, network codes, and causes without secrets', () => {
    const error = {
      name: 'MongooseServerSelectionError', message: `Failed ${uri}`, stack: `secret stack ${uri}`,
      reason: {
        type: 'ReplicaSetNoPrimary',
        servers: new Map([
          ['server1:27017', { type: 'Unknown', error: { name: 'MongoNetworkError', code: 'ECONNREFUSED', message: 'connect ECONNREFUSED server1:27017' } }],
          ['server2:27017', { type: 'Unknown', error: { name: 'MongoNetworkError', message: 'TLS failed for private-user:private@password', cause: { code: 'CERT_HAS_EXPIRED', message: 'certificate expired' } } }],
          ['server3:27017', { type: 'Unknown', error: { name: 'Error', code: 'ENOTFOUND', syscall: 'querySrv', message: `DNS failure ${uri}` } }]
        ])
      }
    };
    const details = mongoErrorDetails(error, uri);
    const text = JSON.stringify(details);
    for (const secret of [uri, 'private-user', 'private%40password', 'private@password', 'secret stack']) expect(text).not.toContain(secret);
    for (const diagnostic of ['ReplicaSetNoPrimary', 'server1:27017', 'ECONNREFUSED', 'CERT_HAS_EXPIRED', 'ENOTFOUND', 'querySrv']) expect(text).toContain(diagnostic);
  });

  test('bounds nested causes and does not serialize arbitrary driver properties', () => {
    const error: Record<string, unknown> = { name: 'Error', message: 'failure', credentials: { password: 'private' } };
    error.cause = error;
    const text = JSON.stringify(mongoErrorDetails(error));
    expect(text.length).toBeLessThan(500);
    expect(text).not.toContain('credentials');
    expect(text).not.toContain('private');
  });
});
