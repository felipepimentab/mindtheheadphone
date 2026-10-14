type ErrorRecord = Record<string, unknown>;

function record(value: unknown): ErrorRecord {
  return typeof value === 'object' && value !== null ? value as ErrorRecord : {};
}

/** Only serialize diagnostic fields, never a driver object, stack, or configuration. */
export function mongoErrorDetails(error: unknown, uri = '') {
  const secrets = new Set([uri]);
  try {
    const parsed = new URL(uri);
    for (const credential of [parsed.username, parsed.password]) {
      if (credential) {
        secrets.add(credential);
        secrets.add(decodeURIComponent(credential));
      }
    }
    // URI query parameters can also contain authentication material.
    for (const [key, value] of parsed.searchParams) {
      if (/password|secret|token|credential/i.test(key) && value) secrets.add(value);
    }
  } catch {
    // Malformed URIs are still removed in full below.
  }

  function redact(value: unknown) {
    if (typeof value !== 'string') return undefined;
    let text = value;
    for (const secret of [...secrets].filter(Boolean).sort((a, b) => b.length - a.length)) {
      text = text.replaceAll(secret, '[redacted]');
    }
    return text.replace(/mongodb(?:\+srv)?:\/\/[^\s"'<>]+/gi, '[redacted MongoDB URI]')
      .replace(/\b(password|passwd|token|secret)\s*[:=]\s*\S+/gi, '$1=[redacted]')
      .replace(/[\r\n\t]/g, ' ').slice(0, 800);
  }

  function summarize(value: unknown, depth = 0): ErrorRecord {
    const source = record(value);
    const details: ErrorRecord = {
      name: redact(source.name),
      message: redact(typeof value === 'string' ? value : source.message),
      code: typeof source.code === 'number' ? source.code : redact(source.code)
    };
    for (const key of ['codeName', 'syscall', 'errno']) {
      const field = source[key];
      if (typeof field === 'number') details[key] = field;
      else if (typeof field === 'string') details[key] = redact(field);
    }
    if (depth < 3 && source.cause) details.cause = summarize(source.cause, depth + 1);
    const reason = record(source.reason);
    if (depth < 3 && reason.servers instanceof Map) {
      details.topology = {
        type: redact(reason.type),
        servers: [...reason.servers].slice(0, 20).map(([address, value]) => {
          const server = record(value);
          return {
            address: redact(address),
            type: redact(server.type),
            error: server.error ? summarize(server.error, depth + 1) : undefined
          };
        })
      };
    }
    return details;
  }

  return summarize(error);
}

export function isMongoConnectivityError(error: unknown): boolean {
  const { name, message } = record(error);
  return typeof name === 'string' && (
    ['MongoNetworkError', 'MongoNetworkTimeoutError', 'MongoServerSelectionError',
      'MongooseServerSelectionError', 'MongoTopologyClosedError', 'MongoNotConnectedError',
      'MongoClientClosedError', 'MongoPoolClearedError', 'MongoWaitQueueTimeoutError'].includes(name)
      || (name === 'MongooseError' && typeof message === 'string'
        && /bufferCommands = false|buffering timed out/.test(message))
  );
}
