import { useCallback, useMemo, useState } from "react";
import { A2HDrawerContext } from "../context/A2HDrawerContext.ts";
import type { A2HDrawerController, A2HDrawerOpenReason, A2HDrawerProviderProps } from "../types.ts";

/**
 * Provider component for A2H Drawer state management
 *
 * @example
 * ```tsx
 * <A2HDrawerProvider>
 *   <App />
 * </A2HDrawerProvider>
 * ```
 */
export function A2HDrawerProvider({ children, defaultOpen = false }: A2HDrawerProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback((_reason?: A2HDrawerOpenReason) => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const controller: A2HDrawerController = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
    }),
    [isOpen, open, close, toggle],
  );

  return <A2HDrawerContext.Provider value={controller}>{children}</A2HDrawerContext.Provider>;
}
