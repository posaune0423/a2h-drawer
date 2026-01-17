import { expect, test } from "bun:test";

test("src/index.ts loads without throwing", async () => {
  const mod = await import("./index");
  expect(mod).toBeDefined();
});
