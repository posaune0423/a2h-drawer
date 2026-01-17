import { useMemo } from "react";
import type { A2HEnvironment } from "../types.ts";
import { isIOSBrowser, isStandalone } from "../utils/environment.ts";

/**
 * Hook to get the A2H environment information
 *
 * @returns Object with isIOSBrowser and isStandalone flags
 *
 * @example
 * ```tsx
 * function InstallButton() {
 *   const { isIOSBrowser, isStandalone } = useA2HEnvironment();
 *   const { open } = useA2HDrawer();
 *
 *   // Don't show install prompt if not iOS or already installed
 *   if (!isIOSBrowser || isStandalone) {
 *     return null;
 *   }
 *
 *   return <button onClick={open}>Install</button>;
 * }
 * ```
 */
export function useA2HEnvironment(): A2HEnvironment {
  return useMemo(
    () => ({
      isIOSBrowser: isIOSBrowser(),
      isStandalone: isStandalone(),
    }),
    [],
  );
}
