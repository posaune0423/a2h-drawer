/**
 * a2h-drawer type definitions
 */

/**
 * Reason for opening the A2H drawer
 */
export type A2HDrawerOpenReason = "install_button" | "programmatic";

/**
 * Controller interface for managing the A2H drawer state
 */
export interface A2HDrawerController {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Open the modal with an optional reason */
  open: (reason?: A2HDrawerOpenReason) => void;
  /** Close the modal */
  close: () => void;
  /** Toggle the modal state */
  toggle: () => void;
}

/**
 * Result returned by useA2HDrawer hook
 */
export interface UseA2HDrawerResult {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Open the modal */
  open: () => void;
  /** Close the modal */
  close: () => void;
  /** Toggle the modal state */
  toggle: () => void;
}

/**
 * Host app information extracted from the page
 */
export interface HostAppInfo {
  /** App title (from document.title or meta tags) */
  title: string | null;
  /** App description (from meta description) */
  description: string | null;
  /** App icon URL (from favicon or apple-touch-icon) */
  iconUrl: string | null;
}

/**
 * Options for extracting host app information
 */
export interface HostAppInfoOptions {
  /** Override values for app info */
  override?: Partial<HostAppInfo>;
  /** Preferred icon filenames to prioritize */
  preferIconFilenames?: string[];
}

/**
 * Environment information for A2H display conditions
 */
export interface A2HEnvironment {
  /** Whether running in iOS browser */
  isIOSBrowser: boolean;
  /** Whether already added to home screen (standalone mode) */
  isStandalone: boolean;
}

/**
 * Media configuration for instruction steps
 */
export interface A2HMedia {
  /** Type of media */
  kind: "image" | "video";
  /** Media source URL */
  src: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * Props for the A2HInstallModal component
 */
export interface A2HInstallModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void;
  /** App information to display */
  appInfo?: HostAppInfo;
  /** Media to display with instructions */
  media?: A2HMedia;
  /** Custom instruction steps */
  steps?: A2HInstructionStep[];
}

/**
 * Instruction step configuration
 */
export interface A2HInstructionStep {
  /** Step title */
  title: string;
  /** Step description */
  description?: string;
  /** Optional icon name */
  icon?: string;
}

/**
 * Provider props
 */
export interface A2HDrawerProviderProps {
  /** Children to render */
  children: React.ReactNode;
  /** Initial open state */
  defaultOpen?: boolean;
}
