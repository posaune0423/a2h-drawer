/**
 * Environment detection utilities
 */

/**
 * Check if we're in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof document !== "undefined" && typeof window !== "undefined";
};

/**
 * Check if the current environment is iOS browser
 */
export const isIOSBrowser = (): boolean => {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent || "";

  // Check for iOS devices
  const isIOS = /iPad|iPhone|iPod/.test(ua);

  // Also check for iPadOS (which reports as Mac in newer versions)
  const isIPadOS = /Macintosh/.test(ua) && "ontouchend" in document;

  return isIOS || isIPadOS;
};

/**
 * Check if the app is running in standalone mode (added to home screen)
 */
export const isStandalone = (): boolean => {
  if (typeof navigator === "undefined") return false;

  // Check iOS-specific standalone property
  if ("standalone" in navigator && navigator.standalone === true) {
    return true;
  }

  // Check display-mode media query (works across platforms)
  if (typeof matchMedia === "function") {
    const mq = matchMedia("(display-mode: standalone)");
    if (mq.matches) return true;
  }

  return false;
};
