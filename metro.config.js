// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const http = require("http");
const https = require("https");

const config = getDefaultConfig(__dirname);

// Forward /supabase/* on the dev server to the Supabase API.
//
// The web app is often opened from another device (a phone on the tailnet,
// over https). There, a Supabase URL like http://127.0.0.1:54321 points at the
// phone itself, and an http URL is blocked on an https page anyway. Going
// through the dev server keeps every request on the page's own origin.
// lib/supabase.ts switches to this path when SUPABASE_URL is a loopback URL.
const PROXY_PREFIX = "/supabase/";
const target = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL) : null;

function supabaseProxy(req, res, next) {
  if (!target || !req.url || !req.url.startsWith(PROXY_PREFIX)) return next();

  const client = target.protocol === "https:" ? https : http;
  const basePath = target.pathname.replace(/\/$/, "");
  const upstream = client.request(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port,
      method: req.method,
      path: basePath + req.url.slice(PROXY_PREFIX.length - 1),
      headers: { ...req.headers, host: target.host },
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    }
  );
  upstream.on("error", (err) => {
    if (!res.headersSent) res.writeHead(502, { "content-type": "text/plain" });
    res.end(`Supabase proxy error: ${err.message}`);
  });
  req.pipe(upstream);
}

const previousEnhance = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware, server) => {
  const inner = previousEnhance ? previousEnhance(middleware, server) : middleware;
  return (req, res, next) => supabaseProxy(req, res, () => inner(req, res, next));
};

module.exports = config;
