/**
 * Development server for the example app
 *
 * Run with: bun run dev (from example directory)
 */
import index from "./index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    // Static assets
    "/manifest.json": Bun.file(import.meta.dir + "/manifest.json"),
    "/icon.svg": Bun.file(import.meta.dir + "/icon.svg"),
    "/icon-180.svg": Bun.file(import.meta.dir + "/icon-180.svg"),
    "/icon-512.svg": Bun.file(import.meta.dir + "/icon-512.svg"),
    "/favicon.svg": Bun.file(import.meta.dir + "/favicon.svg"),
    "/og-image.svg": Bun.file(import.meta.dir + "/og-image.svg"),
    "/instruction.svg": Bun.file(import.meta.dir + "/instruction.svg"),
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`Example server running at http://localhost:${String(server.port)}`);
console.log(`Open on iOS device to test the A2H drawer`);
