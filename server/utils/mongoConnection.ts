import { randomUUID } from 'node:crypto';
import { createError, getRequestHeader, setResponseHeader } from 'h3';
import type { H3Event } from 'h3';
import type { ConnectOptions } from 'mongoose';
import { isMongoConnectivityError, mongoErrorDetails } from './mongoDiagnostics';

export const MONGO_CONNECT_OPTIONS: ConnectOptions = {
  appName: 'mindtheheadphone',
  serverSelectionTimeoutMS: 5_000,
  connectTimeoutMS: 5_000,
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 60_000,
  bufferCommands: false,
  autoCreate: false
};

interface MongoClient {
  connection: {
    readyState: number
    on: (event: string, listener: (...args: unknown[]) => void) => unknown
  }
  connect: (uri: string, options: ConnectOptions) => Promise<unknown>
  disconnect: () => Promise<unknown>
  probe: () => Promise<unknown>
}

type Log = (level: 'info' | 'warn' | 'error', entry: Record<string, unknown>) => void;

class DatabaseUnavailableError extends Error {
  constructor() {
    super('Database unavailable');
  }
}

/** One owner and one in-flight readiness check per server instance. */
export function createMongoConnectionManager({ client, getUri, log, pause = ms => new Promise(resolve => setTimeout(resolve, ms)) }: {
  client: MongoClient
  getUri: () => string | undefined
  log: Log
  pause?: (ms: number) => Promise<unknown>
}) {
  const instanceId = randomUUID();
  let pending: Promise<void> | undefined;
  let established = false;
  let attemptId = 0;

  function emit(level: Parameters<Log>[0], event: string, details: Record<string, unknown> = {}) {
    log(level, {
      component: 'mongodb', event, instanceId, region: process.env.VERCEL_REGION,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID, readyState: client.connection.readyState,
      ...details
    });
  }

  for (const event of ['connected', 'reconnected', 'disconnected', 'close']) {
    client.connection.on(event, () => emit(event === 'disconnected' ? 'warn' : 'info', event));
  }
  client.connection.on('error', error => emit('error', 'connection_error', {
    error: mongoErrorDetails(error, getUri())
  }));

  async function connect() {
    const value = getUri();
    const uri = typeof value === 'string' ? value.trim() : '';
    if (!uri) {
      emit('error', 'configuration_missing', { variable: 'DB_MONGODB_URI / NUXT_MONGODB_URI' });
      throw new DatabaseUnavailableError();
    }

    // An established driver's pool already handles reconnection. Probe it rather
    // than replacing it and leaving another pool monitoring the same cluster.
    if (established) {
      const started = Date.now();
      try {
        await client.probe();
        emit('info', 'connection_recovered', { durationMs: Date.now() - started });
        return;
      } catch (error) {
        emit('error', 'recovery_failed', { durationMs: Date.now() - started, error: mongoErrorDetails(error, uri) });
        throw new DatabaseUnavailableError();
      }
    }

    // Initial failures do not reconnect automatically. Retry once in this request;
    // later requests can retry again because pending is cleared after failure.
    for (let attempt = 1; attempt <= 2; attempt++) {
      const id = ++attemptId;
      const started = Date.now();
      emit('info', 'connection_attempt', { attempt, attemptId: id, options: MONGO_CONNECT_OPTIONS });
      try {
        await client.connect(uri, MONGO_CONNECT_OPTIONS);
        established = true;
        emit('info', 'connection_ready', { attemptId: id, durationMs: Date.now() - started });
        return;
      } catch (error) {
        emit('error', 'connection_failed', { attemptId: id, durationMs: Date.now() - started, error: mongoErrorDetails(error, uri) });
        // Release any partially opened client before the next attempt.
        try {
          await client.disconnect();
        } catch (closeError) {
          emit('error', 'connection_cleanup_failed', { error: mongoErrorDetails(closeError, uri) });
          throw new DatabaseUnavailableError();
        }
        if (attempt < 2) await pause(250);
      }
    }
    throw new DatabaseUnavailableError();
  }

  async function ensureConnected() {
    if (pending) return pending;
    if (client.connection.readyState === 1) return;
    pending = connect();
    try {
      await pending;
    } finally {
      pending = undefined;
    }
  }

  async function run<T>(event: H3Event, operation: string, action: () => Promise<T>): Promise<T> {
    try {
      await ensureConnected();
      return await action();
    } catch (error) {
      if (!(error instanceof DatabaseUnavailableError) && !isMongoConnectivityError(error)) throw error;
      const rawId = getRequestHeader(event, 'x-vercel-id');
      const requestId = rawId && /^[\w:.-]{1,200}$/.test(rawId) ? rawId : undefined;
      emit('error', 'operation_unavailable', {
        operation, requestId,
        error: error instanceof DatabaseUnavailableError ? undefined : mongoErrorDetails(error, getUri())
      });
      setResponseHeader(event, 'Retry-After', 5);
      // Do not attach the raw error as a cause: Nitro would log its URI/credentials.
      throw createError({ statusCode: 503, statusMessage: 'Service Unavailable', message: 'Database temporarily unavailable' });
    }
  }

  return { ensureConnected, run };
}
