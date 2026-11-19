# Provider Setup

This guide configures Nightwatch's backend integrations. Provider keys are stored on the server only.

## 1. Create local configuration

From the repository root:

```bash
cd backend
npm install
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Edit `.env`. Never commit it.

## 2. API credentials

| Variable | Provider | Where to obtain it |
|---|---|---|
| `BRAVE_API_KEY` | Brave Search | [Brave API dashboard](https://api-dashboard.search.brave.com/) |
| `HIBP_API_KEY` | Have I Been Pwned | [HIBP API key page](https://haveibeenpwned.com/API/Key) |
| `SHODAN_API_KEY` | Shodan | [Shodan account](https://account.shodan.io/) |
| `CENSYS_API_ID` | Censys | [Censys platform](https://search.censys.io/) account |
| `CENSYS_API_SECRET` | Censys | Same Censys API credentials page |

Brave uses the `X-Subscription-Token` header. HIBP v3 uses `hibp-api-key` and requires an identifying User-Agent for authenticated requests. Shodan's host lookup accepts the key as a query parameter, which the backend constructs server-side. Censys uses HTTP Basic authentication with API ID and secret.

## 3. Free public-data services

No Nightwatch API key is configured for these adapters:

- RDAP: `rdap.org` routes domain/IP lookups to an RDAP service.
- DNS: Cloudflare DNS-over-HTTPS JSON endpoint.
- crt.sh: public certificate-transparency search.
- Internet Archive: Wayback CDX index.

These services still have availability, fair-use, and operational constraints. Handle throttling and outages gracefully.

## 4. Local run

Set these values in `.env`:

```dotenv
PORT=8787
NODE_ENV=development
CORS_ORIGIN=http://127.0.0.1:5500
USER_AGENT=Nightwatch-OSINT/0.1 (contact: your-project-contact)
```

Then start the API:

```bash
npm run dev
```

Open `http://127.0.0.1:8787/api/health`. Serve the frontend root folder on port 5500 using a local static server such as VS Code Live Server.

## 5. Test a request

```bash
curl -X POST http://127.0.0.1:8787/api/investigate \
  -H "Content-Type: application/json" \
  -d '{"type":"domain","value":"example.com","authorized":true}'
```

For an email check, only submit an address you own or are explicitly authorized to assess. The email address is sent to HIBP's API. HIBP's breach endpoint requires a subscription key; plan and rate limits vary. HIBP does not return users' passwords.

## 6. Deployment

Deploy the backend to a Node-compatible host. Add environment variables through the host's encrypted secret manager. Set `CORS_ORIGIN` to the exact HTTPS origin serving the frontend. Do not place provider keys in GitHub Pages, static-site environment variables, HTML, or `app.js`.

Before public launch, add authentication, persistent rate limiting, request auditing, provider-specific concurrency controls, and a privacy notice. The starter backend is a development foundation, not a hardened public service.
