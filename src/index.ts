/**
 * a2h-drawer - iOS PWA "Add to Home Screen" instruction drawer
 *
 * @packageDocumentation
 *
 * @example
 * ```tsx
 * import { A2HDrawerProvider, A2HDrawer, useA2HDrawer, useA2HEnvironment } from 'a2h-drawer';
 * import 'a2h-drawer/styles';
 *
 * function App() {
 *   return (
 *     <A2HDrawerProvider>
 *       <InstallButton />
 *       <A2HDrawer />
 *     </A2HDrawerProvider>
 *   );
 * }
 *
 * function InstallButton() {
 *   const { isIOSBrowser, isStandalone } = useA2HEnvironment();
 *   const { open } = useA2HDrawer();
 *
 *   // Only show on iOS, and not if already installed
 *   if (!isIOSBrowser || isStandalone) return null;
 *
 *   return <button onClick={open}>Install</button>;
 * }
 * ```
 */

// Components
export {
  A2HDrawer,
  A2HDrawerPortal,
  A2HDrawerProvider,
  A2HInstallModal,
  CloseIcon,
  DefaultAppIcon,
  HomeIcon,
  PlusIcon,
  ShareIcon,
  StepIcons,
} from "./components/index.ts";
export type { A2HDrawerProps } from "./components/index.ts";

// Hooks
export { useA2HDrawer, useA2HEnvironment, useHostAppInfo } from "./hooks/index.ts";

// Utils
export { extractHostMetadata, isBrowser, isIOSBrowser, isStandalone } from "./utils/index.ts";

// Types
export type {
  A2HDrawerController,
  A2HDrawerOpenReason,
  A2HDrawerProviderProps,
  A2HEnvironment,
  A2HInstallModalProps,
  A2HInstructionStep,
  A2HMedia,
  HostAppInfo,
  HostAppInfoOptions,
  UseA2HDrawerResult,
} from "./types.ts";
