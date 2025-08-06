import { beforeEach, describe, expect, it, mock } from "bun:test";
import { act, renderHook } from "@testing-library/react";
import { useA2HDetection } from "../src/hooks/use-a2h-detection";
import "./setup";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Mock the utils
const mockDetectPlatform = mock(() => "desktop");
const mockCheckStandaloneMode = mock(() => false);

mock.module("../src/utils", () => ({
  detectPlatform: mockDetectPlatform,
  checkStandaloneMode: mockCheckStandaloneMode,
}));

type MockEventListener = {
  mock: {
    calls: [string, (event: Event) => void][];
  };
} & ((type: string, listener: (event: Event) => void) => void);

describe("useA2HDetection", () => {
  beforeEach(() => {
    // Reset mocks
    mockDetectPlatform.mockReset();
    mockCheckStandaloneMode.mockReset();

    // Set default mock values
    mockDetectPlatform.mockReturnValue("desktop");
    mockCheckStandaloneMode.mockReturnValue(false);

    // Setup window event listener mocks
    global.window.addEventListener = mock();
    global.window.removeEventListener = mock();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useA2HDetection());

    expect(result.current.isInstallable).toBe(false);
    expect(result.current.installPrompt).toBe(null);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.platform).toBe("desktop");
  });

  it("should add and remove event listeners", () => {
    const { unmount } = renderHook(() => useA2HDetection());

    expect(global.window.addEventListener).toHaveBeenCalledWith("beforeinstallprompt", expect.any(Function));
    expect(global.window.addEventListener).toHaveBeenCalledWith("appinstalled", expect.any(Function));

    unmount();

    expect(global.window.removeEventListener).toHaveBeenCalledWith("beforeinstallprompt", expect.any(Function));
    expect(global.window.removeEventListener).toHaveBeenCalledWith("appinstalled", expect.any(Function));
  });

  it("should handle install prompt event", () => {
    const { result } = renderHook(() => useA2HDetection());

    const mockPromptEvent = {
      preventDefault: mock(),
      prompt: mock(),
      userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
      platforms: ["web"] as ReadonlyArray<string>,
    } as unknown as BeforeInstallPromptEvent;

    // Simulate beforeinstallprompt event
    act(() => {
      const addEventListenerCalls = (global.window.addEventListener as MockEventListener).mock.calls;
      const beforeInstallPromptHandler = addEventListenerCalls.find((call) => call[0] === "beforeinstallprompt")?.[1];

      beforeInstallPromptHandler?.(mockPromptEvent);
    });

    expect(result.current.isInstallable).toBe(true);
    expect(result.current.installPrompt).toBe(mockPromptEvent);
  });

  it("should handle app installed event", () => {
    const { result } = renderHook(() => useA2HDetection());

    // First set up an install prompt
    const mockPromptEvent = {
      preventDefault: mock(),
      prompt: mock(),
      userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
      platforms: ["web"] as ReadonlyArray<string>,
    } as unknown as BeforeInstallPromptEvent;

    act(() => {
      const addEventListenerCalls = (global.window.addEventListener as MockEventListener).mock.calls;
      const beforeInstallPromptHandler = addEventListenerCalls.find((call) => call[0] === "beforeinstallprompt")?.[1];

      beforeInstallPromptHandler?.(mockPromptEvent);
    });

    // Then simulate app installed
    act(() => {
      const addEventListenerCalls = (global.window.addEventListener as MockEventListener).mock.calls;
      const appInstalledHandler = addEventListenerCalls.find((call) => call[0] === "appinstalled")?.[1];

      appInstalledHandler?.(new Event("appinstalled"));
    });

    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.installPrompt).toBe(null);
  });

  it("should handle install process", async () => {
    const { result } = renderHook(() => useA2HDetection());

    const mockPromptEvent = {
      preventDefault: mock(),
      prompt: mock().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
      platforms: ["web"] as ReadonlyArray<string>,
    } as unknown as BeforeInstallPromptEvent;

    // Set up install prompt
    act(() => {
      const addEventListenerCalls = (global.window.addEventListener as MockEventListener).mock.calls;
      const beforeInstallPromptHandler = addEventListenerCalls.find((call) => call[0] === "beforeinstallprompt")?.[1];

      beforeInstallPromptHandler?.(mockPromptEvent);
    });

    // Call handleInstall
    await act(async () => {
      await result.current.handleInstall();
    });

    expect(mockPromptEvent.prompt).toHaveBeenCalled();
    expect(result.current.isInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.installPrompt).toBe(null);
  });

  it("should handle install rejection", async () => {
    const { result } = renderHook(() => useA2HDetection());

    const mockPromptEvent = {
      preventDefault: mock(),
      prompt: mock().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: "dismissed", platform: "web" }),
      platforms: ["web"] as ReadonlyArray<string>,
    } as unknown as BeforeInstallPromptEvent;

    // Set up install prompt
    act(() => {
      const addEventListenerCalls = (global.window.addEventListener as MockEventListener).mock.calls;
      const beforeInstallPromptHandler = addEventListenerCalls.find((call) => call[0] === "beforeinstallprompt")?.[1];

      beforeInstallPromptHandler?.(mockPromptEvent);
    });

    // Call handleInstall
    await act(async () => {
      await result.current.handleInstall();
    });

    expect(mockPromptEvent.prompt).toHaveBeenCalled();
    // Should not change state for dismissed
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isInstallable).toBe(true);
  });

  it("should handle install when no prompt available", async () => {
    const { result } = renderHook(() => useA2HDetection());

    await act(async () => {
      await result.current.handleInstall();
    });

    // Should not crash and state should remain unchanged
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.isInstallable).toBe(false);
  });
});
