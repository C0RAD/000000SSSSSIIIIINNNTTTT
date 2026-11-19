# Nightwatch Backend Architecture

## Decision

Use a small Node.js 20+ / Express API behind the existing static frontend. The browser sends an identifier and an explicit authorization attestation to Nightwatch; the backend validates it, fans out to the relevant provider adapters, normalizes the returned observations, and sends source-attributed results to the browser.

No provider secret is shipped to the browser.

## Request flow

1. Frontend submits `POST /api/investigate` with `type`, `value`, and `authorized: true`.
2. API validates the identifier format, rejects credential-like inputs, applies a rate limit, and requires the attestation.
3. Router selects only the providers relevant to that identifier type.
4. Provider adapters call documented HTTPS endpoints with bounded timeouts.
5. Each observation is normalized to provider, source URL, retrieval timestamp, summary, and data.
6. Frontend displays results as unverified observations, not identity conclusions.

## Provider routing

| Identifier | Providers |
|---|---|
| Username | Brave Search |
| Discord ID | Brave Search for public indexed references; no private Discord API access |
| Email | Have I Been Pwned breach metadata |
| Domain | RDAP, Cloudflare DNS, crt.sh, Internet Archive, Brave Search |
| IP | RDAP, Shodan, Censys |

Provider adapters return `null` when their optional key is not configured. A provider failure is isolated and does not fail the complete investigation.

## Components

- `backend/src/server.js`: HTTP API, validation, consent gate, rate limiting, provider routing, generic error handling.
- `backend/src/providers.js`: provider-specific HTTP adapters and result normalization.
- `backend/.env.example`: names of server-side secrets and local settings.
- `backend/README.md`: installation and API usage.

## Security and privacy

- API keys exist only in backend environment variables.
- HIBP email checks send the submitted email to HIBP. Obtain explicit user authorization and disclose this before the request.
- Shodan and Censys lookups are limited to IP identifiers supplied for authorized assessment; no scan or probe endpoint is used.
- The authorization checkbox is an attestation, not proof of ownership. Production deployments should add user authentication, case-level authorization, audit events, and an abuse review process.
- Do not accept passwords, access tokens, cookies, or secret material as investigation inputs.
- Do not log raw identifiers or provider response bodies.
- Use HTTPS, strict CORS, request-size limits, provider timeouts, rate limits, and secret rotation.
- Treat provider results as observations with provenance. A matching username, IP, or email does not prove that two accounts or systems share an owner.
- Apply data minimization and retention limits. Do not create a bulk people-search or credential-enumeration workflow.

## Production follow-up

1. Add authenticated users and case-level access control.
2. Add durable audit metadata without recording raw sensitive query values.
3. Add a shared rate-limit store and per-provider concurrency limits.
4. Add automated tests with mocked provider responses.
5. Add a frontend consent disclosure and render normalized provider results.
6. Configure a deployment platform with encrypted environment secrets and HTTPS.
