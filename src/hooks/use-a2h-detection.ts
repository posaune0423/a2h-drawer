import { useEffect, useState } from "react";
import { checkStandaloneMode, detectPlatform } from "../utils";

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
    // Initialize platform detection and installation status
    setPlatform(detectPlatform());
    setIsInstalled(checkStandaloneMode());

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

    // Add event listeners
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
