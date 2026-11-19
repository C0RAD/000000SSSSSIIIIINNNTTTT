const USER_AGENT = process.env.USER_AGENT || "Nightwatch-OSINT/0.1";

async function getJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(12_000),
    headers: { "user-agent": USER_AGENT, accept: "application/json", ...(options.headers || {}) }
  });
  if (!response.ok) {
    const error = new Error(`Provider returned HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

const result = (provider, url, summary, data = {}) => ({
  provider, sourceUrl: url, retrievedAt: new Date().toISOString(), summary, data
});

export async function braveSearch(query) {
  if (!process.env.BRAVE_API_KEY) return null;
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", query);
  url.searchParams.set("count", "8");
  const data = await getJson(url, { headers: { "X-Subscription-Token": process.env.BRAVE_API_KEY } });
  return result("Brave Search", "https://search.brave.com/", "Public web search results", {
    items: (data.web?.results || []).slice(0, 8).map(x => ({
      title: x.title, url: x.url, description: x.description, age: x.age || null
    }))
  });
}

export async function hibpEmail(email) {
  if (!process.env.HIBP_API_KEY) return null;
  const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`;
  try {
    const data = await getJson(url, { headers: { "hibp-api-key": process.env.HIBP_API_KEY } });
    return result("Have I Been Pwned", "https://haveibeenpwned.com/", "Breach records returned for this email address", {
      breaches: data.map(x => ({ name: x.Name, title: x.Title, domain: x.Domain, breachDate: x.BreachDate, dataClasses: x.DataClasses }))
    });
  } catch (error) {
    if (error.status === 404) return result("Have I Been Pwned", "https://haveibeenpwned.com/", "No breach records were returned for this address", { breaches: [] });
    throw error;
  }
}

export async function shodanIp(ip) {
  if (!process.env.SHODAN_API_KEY) return null;
  const url = new URL(`https://api.shodan.io/shodan/host/${encodeURIComponent(ip)}`);
  url.searchParams.set("key", process.env.SHODAN_API_KEY);
  const data = await getJson(url);
  return result("Shodan", "https://www.shodan.io/", "Publicly indexed host information", {
    ip: data.ip_str, ports: data.ports || [], hostnames: data.hostnames || [],
    country: data.country_name || null, org: data.org || null,
    services: (data.data || []).slice(0, 12).map(x => ({ port: x.port, transport: x.transport, product: x.product || null, timestamp: x.timestamp }))
  });
}

export async function censysIp(ip) {
  if (!process.env.CENSYS_API_ID || !process.env.CENSYS_API_SECRET) return null;
  const data = await getJson(`https://search.censys.io/api/v2/hosts/${encodeURIComponent(ip)}`, {
    headers: { authorization: "Basic " + Buffer.from(process.env.CENSYS_API_ID + ":" + process.env.CENSYS_API_SECRET).toString("base64") }
  });
  const host = data.result || {};
  return result("Censys", "https://search.censys.io/", "Public host and service observations", {
    ip: host.ip, lastUpdatedAt: host.last_updated_at || null,
    services: (host.services || []).slice(0, 20).map(x => ({ port: x.port, serviceName: x.service_name, transportProtocol: x.transport_protocol }))
  });
}

export async function dnsLookup(domain) {
  const url = new URL("https://cloudflare-dns.com/dns-query");
  url.searchParams.set("name", domain);
  url.searchParams.set("type", "A");
  const data = await getJson(url, { headers: { accept: "application/dns-json" } });
  return result("Cloudflare DNS", "https://developers.cloudflare.com/1.1.1.1/", "Public DNS A records", {
    answers: (data.Answer || []).map(x => ({ name: x.name, type: x.type, value: x.data, ttl: x.TTL }))
  });
}

export async function rdapLookup(type, value) {
  const kind = type === "ip" ? "ip" : "domain";
  const url = `https://rdap.org/${kind}/${encodeURIComponent(value)}`;
  const data = await getJson(url);
  return result("RDAP", "https://www.icann.org/rdap", "Registration data returned by an RDAP service", {
    handle: data.handle || null, name: data.ldhName || data.name || null,
    status: data.status || [], events: (data.events || []).map(x => ({ action: x.eventAction, date: x.eventDate })),
    entities: (data.entities || []).map(x => ({ roles: x.roles || [] }))
  });
}

export async function certificateSearch(domain) {
  const url = new URL("https://crt.sh/");
  url.searchParams.set("q", `%25.${domain}`);
  url.searchParams.set("output", "json");
  const data = await getJson(url);
  return result("crt.sh", "https://crt.sh/", "Public certificate transparency observations", {
    certificates: (Array.isArray(data) ? data : []).slice(0, 30).map(x => ({
      id: x.id, issuer: x.issuer_name, commonName: x.common_name,
      nameValue: x.name_value, notBefore: x.not_before, notAfter: x.not_after
    }))
  });
}

export async function archiveSearch(domain) {
  const url = new URL("https://web.archive.org/cdx/search/cdx");
  url.searchParams.set("url", domain);
  url.searchParams.set("output", "json");
  url.searchParams.set("filter", "statuscode:200");
  url.searchParams.set("fl", "timestamp,original,statuscode");
  url.searchParams.set("collapse", "digest");
  url.searchParams.set("limit", "30");
  const data = await getJson(url);
  const rows = Array.isArray(data) ? data.slice(1) : [];
  return result("Internet Archive", "https://web.archive.org/", "Historical public page captures", {
    captures: rows.map(x => ({ timestamp: x[0], original: x[1], status: x[2] }))
  });
}
