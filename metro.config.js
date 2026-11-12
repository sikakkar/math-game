// Learn more https://docs.expo.dev/guides/customizing-metro
const http = require("http");
const https = require("https");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Proxy /__supabase/* to SUPABASE_URL so the web app can reach a local Supabase through the dev
// server's own origin. A phone or another computer opening the dev server cannot reach
// 127.0.0.1:54321 directly — it would be its own loopback. See lib/supabase.ts.
const PROXY_PREFIX = "/__supabase";
const target = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL) : null;

if (target) {
  const client = target.protocol === "https:" ? https : http;
  config.server = config.server ?? {};
  const enhance = config.server.enhanceMiddleware;
  config.server.enhanceMiddleware = (middleware, server) => {
    const inner = enhance ? enhance(middleware, server) : middleware;
    return (req, res, next) => {
      if (!req.url || !req.url.startsWith(PROXY_PREFIX + "/")) return inner(req, res, next);

      const headers = { ...req.headers, host: target.host };
      delete headers.origin;
      delete headers.referer;
      const upstream = client.request(
        {
          protocol: target.protocol,
          hostname: target.hostname,
          port: target.port,
          method: req.method,
          path: req.url.slice(PROXY_PREFIX.length),
          headers,
        },
        (upRes) => {
          res.writeHead(upRes.statusCode ?? 502, upRes.headers);
          upRes.pipe(res);
        }
      );
      upstream.on("error", (err) => {
        if (!res.headersSent) res.writeHead(502, { "content-type": "text/plain" });
        res.end(`Supabase proxy error: ${err.message}`);
      });
      req.pipe(upstream);
    };
  };
}

module.exports = config;
