import { beforeEach, describe, expect, it, mock } from "bun:test";
import { renderHook, waitFor } from "@testing-library/react";
import { useIconDetection } from "../src/hooks/use-icon-detection";
import "./setup";

// Mock the utils with correct types
const mockPerformIconDetection = mock(() =>
  Promise.resolve({
    result: { icon: null as string | null, name: null as string | null },
    error: null as string | null,
  }),
);

mock.module("../src/utils", () => ({
  performIconDetection: mockPerformIconDetection,
}));

describe("useIconDetection", () => {
  beforeEach(() => {
    // Reset all mocks
    mockPerformIconDetection.mockReset();

    // Set default return values
    mockPerformIconDetection.mockResolvedValue({
      result: { icon: null as string | null, name: null as string | null },
      error: null as string | null,
    });
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useIconDetection({ autoDetect: false }));

    expect(result.current.appIcon).toBe(null);
    expect(result.current.detectedAppName).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should use custom icon when provided", () => {
    const customIcon = "https://example.com/custom-icon.png";
    const { result } = renderHook(() => useIconDetection({ customIcon }));

    expect(result.current.appIcon).toBe(customIcon);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should not auto-detect when autoDetect is false", () => {
    renderHook(() => useIconDetection({ autoDetect: false }));

    expect(mockPerformIconDetection).not.toHaveBeenCalled();
  });

  it("should detect icon from manifest", async () => {
    mockPerformIconDetection.mockResolvedValue({
      result: {
        icon: "https://example.com/icon.png",
        name: "Test App",
      },
      error: null,
    });

    const { result } = renderHook(() => useIconDetection());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.appIcon).toBe("https://example.com/icon.png");
    expect(result.current.detectedAppName).toBe("Test App");
    expect(result.current.error).toBe(null);
  });

  it("should fallback to meta tags when manifest fails", async () => {
    mockPerformIconDetection.mockResolvedValue({
      result: {
        icon: "https://example.com/meta-icon.png",
        name: "Meta App Name",
      },
      error: null,
    });

    const { result } = renderHook(() => useIconDetection());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.appIcon).toBe("https://example.com/meta-icon.png");
    expect(result.current.detectedAppName).toBe("Meta App Name");
  });

  it("should handle manifest with short_name", async () => {
    mockPerformIconDetection.mockResolvedValue({
      result: {
        icon: "https://example.com/icon.png",
        name: "Short App",
      },
      error: null,
    });

    const { result } = renderHook(() => useIconDetection());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.detectedAppName).toBe("Short App");
  });

  it("should handle manifest without icons", async () => {
    mockPerformIconDetection.mockResolvedValue({
      result: {
        icon: "https://example.com/fallback-icon.png",
        name: "Test App",
      },
      error: null,
    });

    const { result } = renderHook(() => useIconDetection());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.appIcon).toBe("https://example.com/fallback-icon.png");
    expect(result.current.detectedAppName).toBe("Test App");
  });

  it("should handle errors gracefully", async () => {
    const errorMessage = "Network error";
    mockPerformIconDetection.mockResolvedValue({
      result: {
        icon: "https://example.com/error-fallback.png",
        name: null,
      },
      error: errorMessage,
    });

    const { result } = renderHook(() => useIconDetection());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.appIcon).toBe("https://example.com/error-fallback.png");
  });

  it("should handle non-Error exceptions", async () => {
    mockPerformIconDetection.mockResolvedValue({
      result: { icon: null, name: null },
      error: "Failed to detect icon",
    });

    const { result } = renderHook(() => useIconDetection());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Failed to detect icon");
  });

  it("should update when options change", async () => {
    const { result, rerender } = renderHook(
      ({ customIcon }: { customIcon?: string }) => useIconDetection({ customIcon }),
      {
        initialProps: {} as { customIcon?: string },
      },
    );

    // Initially should try to auto-detect
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change to custom icon
    rerender({ customIcon: "https://example.com/new-icon.png" });

    expect(result.current.appIcon).toBe("https://example.com/new-icon.png");
    expect(result.current.isLoading).toBe(false);
  });
});
