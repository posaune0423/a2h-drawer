import type { HostAppInfo, HostAppInfoOptions } from "../types.ts";
import { isBrowser } from "./environment.ts";

/**
 * Extract title from document with priority:
 * 1. og:title meta tag
 * 2. document.title
 */
const extractTitle = (): string | null => {
  if (!isBrowser()) return null;

  // Priority 1: og:title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogTitleContent = ogTitle?.getAttribute("content");
  if (ogTitleContent != null && ogTitleContent !== "") {
    return ogTitleContent;
  }

  // Priority 2: document.title
  if (document.title && document.title.trim() !== "") {
    return document.title;
  }

  return null;
};

/**
 * Extract description from meta tags with priority:
 * 1. og:description
 * 2. meta[name="description"]
 */
const extractDescription = (): string | null => {
  if (!isBrowser()) return null;

  // Priority 1: og:description
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogDescContent = ogDesc?.getAttribute("content");
  if (ogDescContent != null && ogDescContent !== "") {
    return ogDescContent;
  }

  // Priority 2: meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  const metaDescContent = metaDesc?.getAttribute("content");
  if (metaDescContent != null && metaDescContent !== "") {
    return metaDescContent;
  }

  return null;
};

/**
 * Parse size string like "180x180" to get the larger dimension
 */
const parseIconSize = (sizes: string | null): number => {
  if (sizes == null || sizes === "") return 0;
  const match = sizes.match(/(\d+)x(\d+)/);
  if (match && match[1] != null && match[2] != null) {
    return Math.max(Number.parseInt(match[1], 10), Number.parseInt(match[2], 10));
  }
  return 0;
};

/**
 * Extract icon URL from link tags with priority:
 * 1. Preferred filenames (if specified)
 * 2. apple-touch-icon (largest first)
 * 3. icon
 * 4. shortcut icon
 */
const extractIconUrl = (preferIconFilenames?: string[]): string | null => {
  if (!isBrowser()) return null;

  const iconLinks = document.querySelectorAll(
    'link[rel="apple-touch-icon"], link[rel*="icon"], link[rel="shortcut icon"]',
  );

  if (iconLinks.length === 0) return null;

  // Check for preferred filenames first
  if (preferIconFilenames && preferIconFilenames.length > 0) {
    for (const filename of preferIconFilenames) {
      for (const link of iconLinks) {
        const href = link.getAttribute("href");
        if (href?.endsWith(filename)) {
          return href;
        }
      }
    }
  }

  // Collect and sort icons by priority
  const icons: Array<{ href: string; priority: number; size: number }> = [];

  for (const link of iconLinks) {
    const href = link.getAttribute("href");
    if (href == null || href === "") continue;

    const rel = link.getAttribute("rel") ?? "";
    const sizes = link.getAttribute("sizes");
    const size = parseIconSize(sizes);

    let priority = 0;
    if (rel === "apple-touch-icon") {
      priority = 3;
    } else if (rel.includes("icon") && !rel.includes("shortcut")) {
      priority = 2;
    } else if (rel === "shortcut icon") {
      priority = 1;
    }

    icons.push({ href, priority, size });
  }

  // Sort by priority (desc), then by size (desc)
  icons.sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return b.size - a.size;
  });

  return icons[0]?.href ?? null;
};

/**
 * Extract host app metadata from the current document
 *
 * @param options - Options for extraction including overrides and preferred filenames
 * @returns HostAppInfo with title, description, and iconUrl
 */
export const extractHostMetadata = (options?: HostAppInfoOptions): HostAppInfo => {
  const extracted: HostAppInfo = {
    title: extractTitle(),
    description: extractDescription(),
    iconUrl: extractIconUrl(options?.preferIconFilenames),
  };

  // Apply overrides
  if (options?.override) {
    return {
      title: options.override.title ?? extracted.title,
      description: options.override.description ?? extracted.description,
      iconUrl: options.override.iconUrl ?? extracted.iconUrl,
    };
  }

  return extracted;
};
