import type { ManifestIcon, WebAppManifest } from "../types/manifest";

/**
 * Detects platform based on user agent
 */
export function detectPlatform(): "ios" | "android" | "desktop" | "unknown" {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }
  if (/android/.test(userAgent)) {
    return "android";
  }
  if (/win|mac|linux/.test(userAgent)) {
    return "desktop";
  }
  return "unknown";
}

/**
 * Checks if app is running in standalone mode (already installed)
 */
export function checkStandaloneMode(): boolean {
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
  const isIOSStandalone =
    "standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

  return isStandalone || isIOSStandalone;
}

/**
 * Finds the most suitable icon from manifest icons
 */
export function findBestIcon(icons: ManifestIcon[]): ManifestIcon | null {
  if (!icons || icons.length === 0) return null;

  return (
    icons
      .filter((icon) => icon.sizes && icon.src)
      .sort((a, b) => {
        const aSizes = a.sizes?.split("x").map(Number) || [0, 0];
        const bSizes = b.sizes?.split("x").map(Number) || [0, 0];
        return (bSizes[0] || 0) * (bSizes[1] || 0) - (aSizes[0] || 0) * (aSizes[1] || 0);
      })[0] || null
  );
}

/**
 * Fetches and parses web app manifest
 */
export async function fetchManifest(): Promise<WebAppManifest | null> {
  const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
  if (!manifestLink?.href) return null;

  try {
    const response = await fetch(manifestLink.href);
    return await response.json();
  } catch (error) {
    console.warn("Failed to parse manifest:", error);
    return null;
  }
}

/**
 * Creates absolute URL from relative path
 */
export function createAbsoluteUrl(src: string): string {
  return new URL(src, window.location.origin).href;
}

/**
 * Finds app icon from various meta tags
 */
export function findMetaIcon(): string | null {
  // Try different meta tags in order of preference
  const selectors = [
    'link[rel="apple-touch-icon"]',
    'link[rel="apple-touch-icon-precomposed"]',
    'link[rel="icon"][type="image/png"]',
    'link[rel="icon"]',
    'link[rel="shortcut icon"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLLinkElement;
    if (element?.href) {
      return element.href;
    }
  }

  return null;
}

/**
 * Extracts app name from meta tags
 */
export function findMetaAppName(): string | null {
  const selectors = [
    'meta[name="application-name"]',
    'meta[property="og:site_name"]',
    'meta[property="og:title"]',
    'meta[name="title"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLMetaElement;
    if (element?.content) {
      return element.content;
    }
  }

  // Fallback to document title
  return document.title || null;
}

export interface IconDetectionResult {
  icon: string | null;
  name: string | null;
}

/**
 * Detects icon and app name from manifest
 */
export async function detectFromManifest(): Promise<IconDetectionResult> {
  const manifest = await fetchManifest();
  if (!manifest) return { icon: null, name: null };

  const appName = manifest.name || manifest.short_name || null;
  let iconUrl: string | null = null;

  if (manifest.icons) {
    const bestIcon = findBestIcon(manifest.icons);
    if (bestIcon) {
      iconUrl = createAbsoluteUrl(bestIcon.src);
    }
  }

  return { icon: iconUrl, name: appName };
}

/**
 * Detects icon and app name from meta tags
 */
export function detectFromMeta(): IconDetectionResult {
  const icon = findMetaIcon();
  const name = findMetaAppName();
  return { icon, name };
}

/**
 * Performs complete icon detection with fallbacks
 */
export async function performIconDetection(): Promise<{
  result: IconDetectionResult;
  error: string | null;
}> {
  try {
    // Try manifest first
    const manifestResult = await detectFromManifest();

    if (manifestResult.icon || manifestResult.name) {
      return { result: manifestResult, error: null };
    }

    // Fallback to meta tags if needed
    const metaResult = detectFromMeta();
    return {
      result: {
        icon: metaResult.icon || manifestResult.icon,
        name: metaResult.name || manifestResult.name,
      },
      error: null,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to detect icon";

    // Try meta tags as fallback
    const metaResult = detectFromMeta();
    return {
      result: metaResult,
      error: errorMessage,
    };
  }
}
