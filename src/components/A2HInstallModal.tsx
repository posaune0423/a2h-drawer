import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { A2HInstallModalProps, A2HInstructionStep } from "../types.ts";
import { CloseIcon, DefaultAppIcon, StepIcons } from "./icons.tsx";

/**
 * Default instruction steps for iOS A2HS
 */
const DEFAULT_STEPS: A2HInstructionStep[] = [
  {
    title: "Share",
    description: "Tap the Share button at the bottom of the screen",
    icon: "share",
  },
  {
    title: "More Options",
    description: 'Scroll down and tap "Add to Home Screen"',
    icon: "more",
  },
  {
    title: "Add to Home Screen",
    description: "Tap Add to install the app on your home screen",
    icon: "add",
  },
];

/**
 * A2H Install Modal Component
 *
 * Displays a modal with app information and installation instructions
 * for adding the PWA to the home screen on iOS devices.
 */
export function A2HInstallModal({ open, onOpenChange, appInfo, media, steps = DEFAULT_STEPS }: A2HInstallModalProps) {
  const titleId = useId();
  const descId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  // Handle animation states
  useEffect(() => {
    if (open) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [open]);

  // Auto-play video when modal opens
  useEffect(() => {
    if (open && media?.kind === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, which is fine
      });
    }
  }, [open, media]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
    },
    [onOpenChange],
  );

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  if (!open) return null;

  const displayTitle = appInfo?.title != null && appInfo.title !== "" ? appInfo.title : "Install App";
  const displayDescription =
    appInfo?.description != null && appInfo.description !== "" ?
      appInfo.description
    : "Add this app to your home screen for quick access";

  return (
    <div
      data-testid="modal-backdrop"
      className="a2h-modal-backdrop fixed inset-0 z-50 flex items-end justify-center bg-black/30 backdrop-blur-sm motion-safe:transition-opacity motion-safe:duration-300"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={`a2h-modal-content mx-4 mb-4 w-full max-w-md rounded-3xl border border-white/30 bg-white/90 shadow-2xl backdrop-blur-2xl motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out ${isAnimating ? "translate-y-4 scale-95 opacity-80" : "translate-y-0 scale-100 opacity-100"} `}
      >
        {/* Header with close button */}
        <div className="flex items-center justify-between border-b border-gray-200/50 p-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900">
            Install {displayTitle}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
          {/* App Info Section */}
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50/50 p-4">
            {appInfo?.iconUrl != null && appInfo.iconUrl !== "" ?
              <img src={appInfo.iconUrl} alt="App icon" className="a2h-app-icon h-16 w-16 rounded-2xl shadow-lg" />
            : <DefaultAppIcon />}
            <div className="min-w-0 flex-1">
              <h3 className="a2h-app-title truncate text-lg font-semibold text-gray-900">{displayTitle}</h3>
              <p id={descId} className="a2h-app-description line-clamp-2 text-sm text-gray-600">
                {displayDescription}
              </p>
            </div>
          </div>

          {/* Media Section */}
          {media && (
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              {media.kind === "image" ?
                <img
                  src={media.src}
                  alt={media.alt != null && media.alt !== "" ? media.alt : "Installation instructions"}
                  className="h-auto w-full"
                />
              : <video
                  ref={videoRef}
                  data-testid="instruction-video"
                  src={media.src}
                  className="h-auto w-full"
                  controls
                  playsInline
                  muted
                  loop
                />
              }
            </div>
          )}

          {/* Instructions Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium tracking-wide text-gray-700 uppercase">How to Install</h3>
            <div className="space-y-2">
              {steps.map((step, index) => {
                const IconComponent = step.icon != null ? StepIcons[step.icon] : undefined;
                return (
                  <div key={step.title} className="a2h-step flex items-start gap-3 rounded-2xl bg-white/50 p-3">
                    <span className="a2h-step-number flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {IconComponent != null && (
                          <span className="text-blue-500">
                            <IconComponent />
                          </span>
                        )}
                        <span className="font-medium text-gray-900">{step.title}</span>
                      </div>
                      {step.description != null && step.description !== "" && (
                        <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200/50 p-4">
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
