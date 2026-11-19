import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { isIP } from "node:net";
import {
  braveSearch, hibpEmail, shodanIp, censysIp, dnsLookup,
  rdapLookup, certificateSearch, archiveSearch
} from "./providers.js";

const app = express();
const port = Number(process.env.PORT || 8787);
const allowedOrigin = process.env.CORS_ORIGIN || "http://127.0.0.1:5500";

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: allowedOrigin.split(",").map(x => x.trim()), methods: ["GET", "POST"], allowedHeaders: ["Content-Type"] }));
app.use(express.json({ limit: "8kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "nightwatch-api", version: "0.1.0" }));

function validate(type, value) {
  if (typeof value !== "string" || !value.trim() || value.length > 253) return "Enter a valid identifier.";
  if (/password|passwd|token|secret/i.test(value)) return "Passwords, tokens, and secrets are not accepted.";
  if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
  if (type === "domain" && !/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i.test(value)) return "Enter a valid domain.";
  if (type === "ip" && isIP(value) === 0) return "Enter a valid IP address.";
  if (type === "discordId" && !/^\d{17,20}$/.test(value)) return "Enter a valid Discord snowflake ID.";
  if (type === "username" && !/^[\p{L}\p{N}._-]{2,64}$/u.test(value)) return "Username contains unsupported characters.";
  return null;
}

async function collect(label, fn, output) {
  try {
    const value = await fn();
    if (value) output.push(value);
  } catch (error) {
    output.push({ provider: label, retrievedAt: new Date().toISOString(), error: "Provider unavailable or request not permitted." });
    console.warn(`[provider] ${label} failed: HTTP ${error.status || "network"}`);
  }
}

app.post("/api/investigate", async (req, res) => {
  const { type, value, authorized } = req.body || {};
  const supported = ["username", "discordId", "email", "domain", "ip"];
  if (!supported.includes(type)) return res.status(400).json({ error: "Unsupported identifier type." });
  const error = validate(type, value);
  if (error) return res.status(400).json({ error });
  if (authorized !== true) return res.status(403).json({ error: "Confirm that you own this identifier or are authorized to investigate it." });

  const target = value.trim();
  const results = [];
  const tasks = [];
  if (type === "username" || type === "discordId") {
    const query = type === "discordId" ? `"${target}" Discord` : `"${target}"`;
    tasks.push(collect("Brave Search", () => braveSearch(query), results));
  }
  if (type === "email") tasks.push(collect("Have I Been Pwned", () => hibpEmail(target), results));
  if (type === "domain") {
    tasks.push(collect("RDAP", () => rdapLookup("domain", target), results));
    tasks.push(collect("DNS", () => dnsLookup(target), results));
    tasks.push(collect("crt.sh", () => certificateSearch(target), results));
    tasks.push(collect("Internet Archive", () => archiveSearch(target), results));
    tasks.push(collect("Brave Search", () => braveSearch(`site:${target}`), results));
  }
  if (type === "ip") {
    tasks.push(collect("RDAP", () => rdapLookup("ip", target), results));
    tasks.push(collect("Shodan", () => shodanIp(target), results));
    tasks.push(collect("Censys", () => censysIp(target), results));
  }
  await Promise.all(tasks);
  res.json({
    query: { type, value: target },
    generatedAt: new Date().toISOString(),
    liveProviders: results.length,
    results,
    note: "Provider observations are not proof of identity, ownership, compromise, or wrongdoing. Verify each result at its source."
  });
});

app.use((err, _req, res, _next) => {
  console.error("[api] request failed", err?.message || "unknown error");
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, () => console.log(`Nightwatch API listening on http://127.0.0.1:${port}`));
