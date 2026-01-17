import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { extractHostMetadata } from "../../src/utils/host-metadata-extractor.ts";

describe("extractHostMetadata", () => {
  beforeEach(() => {
    // Reset document state
    document.head.innerHTML = "";
    document.title = "";
  });

  afterEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  describe("title extraction", () => {
    test("extracts title from document.title", () => {
      document.title = "My Awesome App";

      const result = extractHostMetadata();

      expect(result.title).toBe("My Awesome App");
    });

    test("returns null when title is empty", () => {
      document.title = "";

      const result = extractHostMetadata();

      expect(result.title).toBe(null);
    });

    test("prefers og:title over document.title when available", () => {
      document.title = "Document Title";
      const ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      ogTitle.setAttribute("content", "OG Title");
      document.head.appendChild(ogTitle);

      const result = extractHostMetadata();

      expect(result.title).toBe("OG Title");
    });
  });

  describe("description extraction", () => {
    test("extracts description from meta name='description'", () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", "App description here");
      document.head.appendChild(meta);

      const result = extractHostMetadata();

      expect(result.description).toBe("App description here");
    });

    test("returns null when description meta is missing", () => {
      const result = extractHostMetadata();

      expect(result.description).toBe(null);
    });

    test("prefers og:description over meta description", () => {
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", "Meta description");
      document.head.appendChild(meta);

      const ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      ogDesc.setAttribute("content", "OG description");
      document.head.appendChild(ogDesc);

      const result = extractHostMetadata();

      expect(result.description).toBe("OG description");
    });
  });

  describe("icon extraction", () => {
    test("extracts icon from apple-touch-icon", () => {
      const link = document.createElement("link");
      link.setAttribute("rel", "apple-touch-icon");
      link.setAttribute("href", "/apple-touch-icon.png");
      document.head.appendChild(link);

      const result = extractHostMetadata();

      expect(result.iconUrl).toBe("/apple-touch-icon.png");
    });

    test("extracts icon from rel='icon'", () => {
      const link = document.createElement("link");
      link.setAttribute("rel", "icon");
      link.setAttribute("href", "/favicon.ico");
      document.head.appendChild(link);

      const result = extractHostMetadata();

      expect(result.iconUrl).toBe("/favicon.ico");
    });

    test("prioritizes apple-touch-icon over favicon", () => {
      const favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      favicon.setAttribute("href", "/favicon.ico");
      document.head.appendChild(favicon);

      const appleIcon = document.createElement("link");
      appleIcon.setAttribute("rel", "apple-touch-icon");
      appleIcon.setAttribute("href", "/apple-touch-icon.png");
      document.head.appendChild(appleIcon);

      const result = extractHostMetadata();

      expect(result.iconUrl).toBe("/apple-touch-icon.png");
    });

    test("prefers larger icons by size attribute", () => {
      const smallIcon = document.createElement("link");
      smallIcon.setAttribute("rel", "apple-touch-icon");
      smallIcon.setAttribute("sizes", "120x120");
      smallIcon.setAttribute("href", "/icon-120.png");
      document.head.appendChild(smallIcon);

      const largeIcon = document.createElement("link");
      largeIcon.setAttribute("rel", "apple-touch-icon");
      largeIcon.setAttribute("sizes", "180x180");
      largeIcon.setAttribute("href", "/icon-180.png");
      document.head.appendChild(largeIcon);

      const result = extractHostMetadata();

      expect(result.iconUrl).toBe("/icon-180.png");
    });

    test("allows custom icon filename preference", () => {
      const defaultIcon = document.createElement("link");
      defaultIcon.setAttribute("rel", "icon");
      defaultIcon.setAttribute("href", "/favicon.ico");
      document.head.appendChild(defaultIcon);

      const customIcon = document.createElement("link");
      customIcon.setAttribute("rel", "icon");
      customIcon.setAttribute("href", "/icon.png");
      document.head.appendChild(customIcon);

      const result = extractHostMetadata({ preferIconFilenames: ["icon.png"] });

      expect(result.iconUrl).toBe("/icon.png");
    });

    test("returns null when no icon is found", () => {
      const result = extractHostMetadata();

      expect(result.iconUrl).toBe(null);
    });
  });

  describe("override functionality", () => {
    test("allows overriding all values", () => {
      document.title = "Original Title";

      const result = extractHostMetadata({
        override: {
          title: "Custom Title",
          description: "Custom Description",
          iconUrl: "/custom-icon.png",
        },
      });

      expect(result.title).toBe("Custom Title");
      expect(result.description).toBe("Custom Description");
      expect(result.iconUrl).toBe("/custom-icon.png");
    });

    test("allows partial override", () => {
      document.title = "Original Title";
      const meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      meta.setAttribute("content", "Original Description");
      document.head.appendChild(meta);

      const result = extractHostMetadata({
        override: {
          title: "Custom Title",
        },
      });

      expect(result.title).toBe("Custom Title");
      expect(result.description).toBe("Original Description");
    });
  });

  describe("SSR safety", () => {
    test("handles missing document gracefully in SSR-like environment", () => {
      // This test verifies the pattern - actual SSR would have no document
      // In happy-dom we always have document, so we test the function handles empty values
      document.head.innerHTML = "";
      document.title = "";

      const result = extractHostMetadata();

      expect(result.title).toBe(null);
      expect(result.description).toBe(null);
      expect(result.iconUrl).toBe(null);
    });
  });
});
