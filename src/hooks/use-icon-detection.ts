import { useEffect, useState } from "react";
import type { ManifestIcon, WebAppManifest } from "../types/manifest";

export interface UseIconDetectionOptions {
  /** Whether to automatically detect icons */
  autoDetect?: boolean;
  /** Custom icon URL to use instead of detection */
  customIcon?: string;
}

export interface UseIconDetectionReturn {
  /** The detected or provided app icon URL */
  appIcon: string | null;
  /** The detected app name from manifest */
  detectedAppName: string | null;
  /** Whether icon detection is in progress */
  isLoading: boolean;
  /** Any error that occurred during detection */
  error: string | null;
}

export const useIconDetection = ({
  autoDetect = true,
  customIcon,
}: UseIconDetectionOptions = {}): UseIconDetectionReturn => {
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const [detectedAppName, setDetectedAppName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customIcon) {
      setAppIcon(customIcon);
      setIsLoading(false);
      setError(null);
      return;
    }

    if (!autoDetect) {
      setIsLoading(false);
      return;
    }

    const detectIcon = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try to get manifest first
        const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
        if (manifestLink?.href) {
          try {
            const manifestResponse = await fetch(manifestLink.href);
            const manifest: WebAppManifest = await manifestResponse.json();

            // Get app name from manifest
            if (manifest.name || manifest.short_name) {
              setDetectedAppName(manifest.name || manifest.short_name || null);
            }

            // Get icon from manifest
            if (manifest.icons && manifest.icons.length > 0) {
              // Find the largest icon or the most suitable one
              const suitableIcon = manifest.icons
                .filter((icon: ManifestIcon) => icon.sizes && icon.src)
                .sort((a: ManifestIcon, b: ManifestIcon) => {
                  const aSizes = a.sizes?.split("x").map(Number) || [0, 0];
                  const bSizes = b.sizes?.split("x").map(Number) || [0, 0];
                  return (bSizes[0] || 0) * (bSizes[1] || 0) - (aSizes[0] || 0) * (aSizes[1] || 0);
                })[0];

              if (suitableIcon) {
                const iconUrl = new URL(suitableIcon.src, window.location.origin).href;
                setAppIcon(iconUrl);
                setIsLoading(false);
                return;
              }
            }
          } catch (manifestError) {
            console.warn("Failed to parse manifest:", manifestError);
          }
        }

        // Fallback to meta tags
        const iconSelectors = [
          'link[rel="apple-touch-icon"]',
          'link[rel="apple-touch-icon-precomposed"]',
          'link[rel="icon"][sizes*="192"]',
          'link[rel="icon"][sizes*="512"]',
          'link[rel="shortcut icon"]',
          'link[rel="icon"]',
        ];

        for (const selector of iconSelectors) {
          const iconLink = document.querySelector(selector) as HTMLLinkElement;
          if (iconLink?.href) {
            setAppIcon(iconLink.href);
            break;
          }
        }

        // Try to get app name from meta tags if not found in manifest
        if (!detectedAppName) {
          const nameSelectors = [
            'meta[name="apple-mobile-web-app-title"]',
            'meta[name="application-name"]',
            'meta[property="og:site_name"]',
            'meta[property="og:title"]',
            "title",
          ];

          for (const selector of nameSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              const content = element.getAttribute("content") || element.textContent;
              if (content?.trim()) {
                setDetectedAppName(content.trim());
                break;
              }
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to detect icon");
        console.error("Icon detection failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    detectIcon();
  }, [autoDetect, customIcon, detectedAppName]);

  return {
    appIcon,
    detectedAppName,
    isLoading,
    error,
  };
};
