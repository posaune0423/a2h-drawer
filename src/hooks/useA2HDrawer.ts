import { useContext } from "react";
import { A2HDrawerContext } from "../context/A2HDrawerContext.ts";
import type { UseA2HDrawerResult } from "../types.ts";

/**
 * Hook to control the A2H drawer from anywhere in the app
 *
 * @returns Object with isOpen state and open/close/toggle functions
 *
 * @example
 * ```tsx
 * function InstallButton() {
 *   const { open } = useA2HDrawer();
 *
 *   return (
 *     <button onClick={open}>
 *       Install App
 *     </button>
 *   );
 * }
 * ```
 */
export function useA2HDrawer(): UseA2HDrawerResult {
  const controller = useContext(A2HDrawerContext);

  return {
    isOpen: controller.isOpen,
    open: () => {
      controller.open();
    },
    close: controller.close,
    toggle: controller.toggle,
  };
}
