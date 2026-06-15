import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = 5500;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

http
  .createServer(async (request, response) => {
    try {
      const urlPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
      let filePath = path.join(root, urlPath === "/" ? "index.html" : urlPath);
      if (!filePath.startsWith(root)) throw new Error("Blocked path");
      const info = await stat(filePath);
      if (info.isDirectory()) filePath = path.join(filePath, "index.html");
      const body = await readFile(filePath);
      response.writeHead(200, {
        "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("404 - File not found");
    }
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`Hot Meal Bar preview running at http://127.0.0.1:${port}`);
    console.log("Press Ctrl+C to stop.");
  });
