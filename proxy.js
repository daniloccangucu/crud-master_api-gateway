import http from "http";
import https from "https";
import url from "url";

function customProxy(req, res) {
  const targetUrl = process.env.INVENTORY_API_URL;
  const parsedUrl = url.parse(targetUrl);

  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + req.url.replace("/api/movies", ""),
    method: req.method,
    headers: {
      ...req.headers,
      host: parsedUrl.hostname,
    },
  };

  console.log(
    `Proxying ${req.method} request to: ${options.hostname}:${options.port}${options.path}`
  );

  const proxy = (parsedUrl.protocol === "https:" ? https : http).request(
    options,
    function (proxyRes) {
      console.log(`Response from target: ${proxyRes.statusCode}`);
      proxyRes.pipe(res, { end: true });
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
    }
  );

  proxy.on("error", function (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error");
  });

  if (req.method === "POST" || req.method === "PUT") {
    const bodyData = JSON.stringify(req.body);
    console.log("Forwarding body:", bodyData);
    proxy.setHeader(
      "Content-Type",
      req.headers["content-type"] || "application/json"
    );
    proxy.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxy.write(bodyData);
    proxy.end();
  } else {
    req.pipe(proxy, { end: true });
  }
}

export default customProxy;
