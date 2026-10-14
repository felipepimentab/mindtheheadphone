# Configuration

`NUXT_APP_ORIGIN` is required for mutations and logout in every environment.
Set an exact origin, such as `https://www.mindtheheadphone.com.br` or, during
development, `http://localhost:3000`. HTTPS is required outside development.
Paths, queries, credentials, and wildcards are invalid.

Missing or invalid configuration rejects mutations with HTTP 500 before side
effects. Non-browser clients must send a matching `Origin` header. Reads and
the Google OAuth callback remain unaffected.

Production catalog writes also use `NUXT_APP_ORIGIN` to revalidate recommendation
pages and their navigation payloads, with `BYPASS_TOKEN` authorizing the requests.
The existing on-demand revalidation is supplemented by a two-day ISR expiration
(172800 seconds): the first request after expiration triggers regeneration.

MongoDB uses `DB_MONGODB_URI` at runtime (or private `NUXT_MONGODB_URI` when the
former is unset). Device requests share an awaited connection per server instance,
retry an initial failure once, and return 503 with `Retry-After: 5` if unavailable.
Each attempt has a five-second server-selection timeout. Existing connections are
reused; database writes are never automatically replayed. Reads and mutations check
readiness before querying or uploading images.

Vercel function logs contain JSON entries with `component: "mongodb"`, lifecycle
events, attempt durations, an instance ID, region, deployment ID, and operation
labels. `connection_failed` includes topology/server errors and nested causes;
`operation_unavailable` includes the Vercel request ID when provided. URI credentials
are redacted and raw driver objects/stacks are omitted. A readiness check cannot
prevent a later outage; failed image-save rollback still uses the existing cleanup.
