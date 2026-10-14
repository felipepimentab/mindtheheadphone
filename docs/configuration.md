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
