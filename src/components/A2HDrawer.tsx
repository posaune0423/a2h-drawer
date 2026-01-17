import { useA2HDrawer } from "../hooks/useA2HDrawer.ts";
import { useHostAppInfo } from "../hooks/useHostAppInfo.ts";
import type { A2HInstructionStep, A2HMedia, HostAppInfo, HostAppInfoOptions } from "../types.ts";
import { A2HDrawerPortal } from "./A2HDrawerPortal.tsx";
import { A2HInstallModal } from "./A2HInstallModal.tsx";

export interface A2HDrawerProps {
  /** Override app info (overrides auto-detected values) */
  appInfo?: Partial<HostAppInfo>;
  /** Options for auto-detecting app info */
  appInfoOptions?: HostAppInfoOptions;
  /** Media to display with instructions */
  media?: A2HMedia;
  /** Custom instruction steps */
  steps?: A2HInstructionStep[];
}

/**
 * A2H Drawer component that displays the install modal
 *
 * This component must be used within an A2HDrawerProvider.
 * It automatically detects app info from the page unless overridden.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <A2HDrawerProvider>
 *       <YourApp />
 *       <A2HDrawer />
 *     </A2HDrawerProvider>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom app info and media
 * <A2HDrawer
 *   appInfo={{ title: "Custom Title" }}
 *   media={{ kind: "video", src: "/guide.mp4" }}
 * />
 * ```
 */
export function A2HDrawer({ appInfo: appInfoOverride, appInfoOptions, media, steps }: A2HDrawerProps) {
  const { isOpen, close } = useA2HDrawer();

  // Auto-detect app info with optional overrides
  const detectedAppInfo = useHostAppInfo({
    ...appInfoOptions,
    override: {
      ...appInfoOptions?.override,
      ...appInfoOverride,
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  return (
    <A2HDrawerPortal>
      <A2HInstallModal
        open={isOpen}
        onOpenChange={handleOpenChange}
        appInfo={detectedAppInfo}
        media={media}
        steps={steps}
      />
    </A2HDrawerPortal>
  );
}
