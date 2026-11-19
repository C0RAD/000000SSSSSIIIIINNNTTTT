# Nightwatch API

Node.js 20+ backend for the Nightwatch static frontend. Provider credentials are read only from server environment variables.

## Run locally

1. Install Node.js 20 or newer.
2. In this directory, run `npm install`.
3. Copy `.env.example` to `.env` and add provider keys.
4. Set `CORS_ORIGIN` to the exact origin serving the frontend.
5. Run `npm run dev` or `npm start`.
6. Check `http://127.0.0.1:8787/api/health`.

Serve the repository root separately, for example with VS Code Live Server at `http://127.0.0.1:5500`. Do not open index.html as a file URL when using the API.

## API

`POST /api/investigate`

```json
{ "type": "domain", "value": "example.com", "authorized": true }
```

Supported types: `username`, `discordId`, `email`, `domain`, `ip`.

The authorization flag is an explicit user attestation, not an identity verification mechanism. The API rejects passwords, tokens, and secrets. It does not search for passwords or retrieve private Discord content.

## Providers

- Brave Search: public web results for usernames, Discord IDs, and domains.
- Have I Been Pwned: breach metadata for a submitted email. The email is sent to HIBP over HTTPS; use only for the account owner or an authorized assessment.
- Shodan and Censys: indexed host information for IPs you are authorized to assess.
- RDAP, Cloudflare DNS, crt.sh: public registration, DNS, and certificate-transparency data.
- Internet Archive CDX: historical public URL captures.

Missing API keys disable that provider; they do not prevent the other configured providers from running.

## Security notes

- Never commit `.env`; only commit `.env.example`.
- Keep keys out of browser JavaScript, HTML, frontend build variables, and screenshots.
- Use HTTPS in production, restrict CORS to the deployed frontend origin, and put the API behind authentication before making it public.
- The demo rate limit is IP-based and in-memory. Use a shared store and stronger abuse controls for multi-instance production.
- Provider errors are intentionally generic in API responses. Avoid logging submitted identifiers.
- Review each provider's current terms, plan limits, retention rules, and acceptable-use policy before production use.
