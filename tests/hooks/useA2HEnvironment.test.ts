import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useA2HEnvironment } from "../../src/hooks/useA2HEnvironment.ts";

describe("useA2HEnvironment", () => {
  const originalNavigator = globalThis.navigator;
  const originalMatchMedia = globalThis.matchMedia;

  beforeEach(() => {
    // Reset navigator and matchMedia for each test
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(globalThis, "navigator", {
      value: originalNavigator,
      writable: true,
    });
    Object.defineProperty(globalThis, "matchMedia", {
      value: originalMatchMedia,
      writable: true,
    });
  });

  describe("iOS detection", () => {
    test("detects iOS Safari via userAgent", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
          standalone: false,
        },
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isIOSBrowser).toBe(true);
    });

    test("detects iPad Safari via userAgent", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent:
            "Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
          standalone: false,
        },
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isIOSBrowser).toBe(true);
    });

    test("returns false for Android browser", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent:
            "Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          standalone: undefined,
        },
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isIOSBrowser).toBe(false);
    });

    test("returns false for desktop browser", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          standalone: undefined,
        },
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isIOSBrowser).toBe(false);
    });
  });

  describe("standalone detection", () => {
    test("detects standalone mode via navigator.standalone", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
          standalone: true,
        },
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isStandalone).toBe(true);
    });

    test("detects standalone mode via matchMedia", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
          standalone: false,
        },
        writable: true,
      });
      Object.defineProperty(globalThis, "matchMedia", {
        value: (query: string) => ({
          matches: query === "(display-mode: standalone)",
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isStandalone).toBe(true);
    });

    test("returns false when not in standalone mode", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: {
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15",
          standalone: false,
        },
        writable: true,
      });
      Object.defineProperty(globalThis, "matchMedia", {
        value: () => ({
          matches: false,
          media: "",
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }),
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isStandalone).toBe(false);
    });
  });

  describe("SSR safety", () => {
    test("returns safe defaults when navigator is undefined", () => {
      Object.defineProperty(globalThis, "navigator", {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useA2HEnvironment());

      expect(result.current.isIOSBrowser).toBe(false);
      expect(result.current.isStandalone).toBe(false);
    });
  });
});
