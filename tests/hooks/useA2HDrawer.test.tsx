import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "bun:test";
import type { ReactNode } from "react";
import { A2HDrawerProvider } from "../../src/components/A2HDrawerProvider.tsx";
import { useA2HDrawer } from "../../src/hooks/useA2HDrawer.ts";

describe("useA2HDrawer", () => {
  const wrapper = ({ children }: { children: ReactNode }) => <A2HDrawerProvider>{children}</A2HDrawerProvider>;

  describe("with Provider", () => {
    test("returns isOpen as false initially", () => {
      const { result } = renderHook(() => useA2HDrawer(), { wrapper });

      expect(result.current.isOpen).toBe(false);
    });

    test("open() sets isOpen to true", () => {
      const { result } = renderHook(() => useA2HDrawer(), { wrapper });

      act(() => {
        result.current.open();
      });

      expect(result.current.isOpen).toBe(true);
    });

    test("close() sets isOpen to false", () => {
      const { result } = renderHook(() => useA2HDrawer(), { wrapper });

      act(() => {
        result.current.open();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);
    });

    test("toggle() toggles isOpen state", () => {
      const { result } = renderHook(() => useA2HDrawer(), { wrapper });

      expect(result.current.isOpen).toBe(false);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("without Provider", () => {
    test("returns safe defaults without crashing", () => {
      // This should not throw even without Provider
      const { result } = renderHook(() => useA2HDrawer());

      expect(result.current.isOpen).toBe(false);
    });

    test("open/close/toggle are no-op without Provider", () => {
      const { result } = renderHook(() => useA2HDrawer());

      // Should not throw
      act(() => {
        result.current.open();
        result.current.close();
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });
});
