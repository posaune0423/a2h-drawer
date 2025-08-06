import { useEffect, useState } from "react";
import { performIconDetection } from "../utils";

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

    let mounted = true;

    const detectIcons = async () => {
      if (!mounted) return;

      setIsLoading(true);
      setError(null);

      const { result, error } = await performIconDetection();

      if (!mounted) return;

      if (result.icon) setAppIcon(result.icon);
      if (result.name) setDetectedAppName(result.name);
      setError(error);
      setIsLoading(false);
    };

    detectIcons();

    return () => {
      mounted = false;
    };
  }, [autoDetect, customIcon]);

  return {
    appIcon,
    detectedAppName,
    isLoading,
    error,
  };
};
