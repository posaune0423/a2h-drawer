import { describe, expect, test } from "bun:test";

describe("index.ts exports", () => {
  test("loads without throwing", async () => {
    const mod = await import("../src/index.ts");
    expect(mod).toBeDefined();
  });

  test("exports all components", async () => {
    const mod = await import("../src/index.ts");
    expect(mod.A2HDrawer).toBeDefined();
    expect(mod.A2HDrawerPortal).toBeDefined();
    expect(mod.A2HDrawerProvider).toBeDefined();
    expect(mod.A2HInstallModal).toBeDefined();
  });

  test("exports all hooks", async () => {
    const mod = await import("../src/index.ts");
    expect(mod.useA2HDrawer).toBeDefined();
    expect(mod.useA2HEnvironment).toBeDefined();
    expect(mod.useHostAppInfo).toBeDefined();
  });

  test("exports all utils", async () => {
    const mod = await import("../src/index.ts");
    expect(mod.extractHostMetadata).toBeDefined();
    expect(mod.isBrowser).toBeDefined();
    expect(mod.isIOSBrowser).toBeDefined();
    expect(mod.isStandalone).toBeDefined();
  });

  test("exports icon components", async () => {
    const mod = await import("../src/index.ts");
    expect(mod.CloseIcon).toBeDefined();
    expect(mod.DefaultAppIcon).toBeDefined();
    expect(mod.HomeIcon).toBeDefined();
    expect(mod.PlusIcon).toBeDefined();
    expect(mod.ShareIcon).toBeDefined();
    expect(mod.StepIcons).toBeDefined();
  });
});
