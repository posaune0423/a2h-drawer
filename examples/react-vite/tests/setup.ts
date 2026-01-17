import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "bun:test";

// Register happy-dom globally
GlobalRegistrator.register();

// Ensure document.body exists and is clean for each test
beforeEach(() => {
  document.body.innerHTML = "";
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});
