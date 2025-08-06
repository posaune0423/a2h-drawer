import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface UseA2HDetectionReturn {
  /** Whether the app can be installed */
  isInstallable: boolean;
  /** The install prompt event */
  installPrompt: BeforeInstallPromptEvent | null;
  /** Whether the app is already installed */
  isInstalled: boolean;
  /** Platform information */
  platform: "ios" | "android" | "desktop" | "unknown";
  /** Handle the installation process */
  handleInstall: () => Promise<void>;
}

export const useA2HDetection = (): UseA2HDetectionReturn => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown");

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      if (/iphone|ipad|ipod/.test(userAgent)) {
        setPlatform("ios");
      } else if (/android/.test(userAgent)) {
        setPlatform("android");
      } else if (/win|mac|linux/.test(userAgent)) {
        setPlatform("desktop");
      } else {
        setPlatform("unknown");
      }
    };

    const checkIfInstalled = () => {
      // Check if running in standalone mode (already installed)
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isIOSStandalone =
        "standalone" in window.navigator &&
        Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

      setIsInstalled(isStandalone || isIOSStandalone);
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    // Initialize
    detectPlatform();
    checkIfInstalled();

    // Listen for install prompt
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async (): Promise<void> => {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error("Error during installation:", error);
    }
  };

  return {
    isInstallable,
    installPrompt,
    isInstalled,
    platform,
    handleInstall,
  };
};
