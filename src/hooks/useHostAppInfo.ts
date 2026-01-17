import { useMemo } from "react";
import type { HostAppInfo, HostAppInfoOptions } from "../types.ts";
import { extractHostMetadata } from "../utils/host-metadata-extractor.ts";

/**
 * Hook to get host app information (title, description, icon)
 *
 * @param options - Options for extraction including overrides
 * @returns HostAppInfo with title, description, and iconUrl
 *
 * @example
 * ```tsx
 * function AppInfoDisplay() {
 *   const appInfo = useHostAppInfo();
 *
 *   return (
 *     <div>
 *       <img src={appInfo.iconUrl || '/fallback-icon.png'} alt="" />
 *       <h2>{appInfo.title || 'Unknown App'}</h2>
 *       <p>{appInfo.description || 'No description'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With overrides
 * const appInfo = useHostAppInfo({
 *   override: {
 *     title: 'Custom App Name',
 *   },
 *   preferIconFilenames: ['icon.png', 'icon-192.png'],
 * });
 * ```
 */
export function useHostAppInfo(options?: HostAppInfoOptions): HostAppInfo {
  return useMemo(() => {
    return extractHostMetadata(options);
  }, [options]);
}
