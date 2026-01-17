/**
 * Development orchestrator: starts Tailwind CSS watcher and the dev server
 *
 * Run with: bun run dev (from example directory)
 */

// Start Tailwind CSS watcher
const tailwind = Bun.spawn(["bunx", "@tailwindcss/cli", "-i", "./styles.input.css", "-o", "./styles.css", "--watch"], {
  cwd: import.meta.dir,
  stdout: "inherit",
  stderr: "inherit",
});

// Give Tailwind a moment to generate initial CSS
await Bun.sleep(500);

// Import and start the server (this will block)
await import("./server.ts");

// Cleanup on exit
process.on("SIGINT", () => {
  tailwind.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  tailwind.kill();
  process.exit(0);
});
