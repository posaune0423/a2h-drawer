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
 * A2H Install Modal Component with iOS Native Style
 *
 * Features:
 * - iOS-authentic frosted glass background
 * - SF Pro system font styling
 * - iOS-style buttons and list items
 * - Smooth "ぬるっと" animations
 * - Respects prefers-reduced-motion
 */
export function A2HInstallModal({ open, onOpenChange, appInfo, media, steps = DEFAULT_STEPS }: A2HInstallModalProps) {
  const titleId = useId();
  const descId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPresent, setIsPresent] = useState(open);
  const [phase, setPhase] = useState<"open" | "closing">(open ? "open" : "closing");
  const closeFallbackTimeoutRef = useRef<number | null>(null);

  const finishClose = useCallback(() => {
    if (closeFallbackTimeoutRef.current != null) {
      window.clearTimeout(closeFallbackTimeoutRef.current);
      closeFallbackTimeoutRef.current = null;
    }
    setIsPresent(false);
  }, []);

  // Keep DOM mounted during close animation.
  useEffect(() => {
    if (open) {
      if (closeFallbackTimeoutRef.current != null) {
        window.clearTimeout(closeFallbackTimeoutRef.current);
        closeFallbackTimeoutRef.current = null;
      }
      setIsPresent(true);
      setPhase("open");
      return;
    }

    // If we're not mounted, nothing to do.
    if (!isPresent) return;

    setPhase("closing");
    // Fallback for environments without real CSS animations (e.g. tests).
    closeFallbackTimeoutRef.current = window.setTimeout(() => {
      finishClose();
    }, 650);

    return () => {
      if (closeFallbackTimeoutRef.current != null) {
        window.clearTimeout(closeFallbackTimeoutRef.current);
        closeFallbackTimeoutRef.current = null;
      }
    };
  }, [finishClose, isPresent, open]);

  const handleSheetAnimationEnd = useCallback(
    (e: React.AnimationEvent) => {
      if (e.target !== e.currentTarget) return;
      if (phase !== "closing") return;
      finishClose();
    },
    [finishClose, phase],
  );

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

  // Auto-play video when modal opens
  useEffect(() => {
    if (open && isPresent && media?.kind === "video" && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, which is fine
      });
    }
  }, [isPresent, open, media]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (phase === "closing") return;
      if (e.target === e.currentTarget) {
        onOpenChange(false);
      }
    },
    [onOpenChange, phase],
  );

  const handleClose = useCallback(() => {
    if (phase === "closing") return;
    onOpenChange(false);
  }, [onOpenChange, phase]);

  if (!isPresent) return null;

  const displayTitle = appInfo?.title != null && appInfo.title !== "" ? appInfo.title : "Install App";
  const displayDescription =
    appInfo?.description != null && appInfo.description !== "" ?
      appInfo.description
    : "Add this app to your home screen for quick access";

  return (
    <div
      data-testid="modal-backdrop"
      data-state={phase}
      className="a2h-modal-backdrop"
      onClick={handleBackdropClick}
    >
      {/* iOS Style Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        data-state={phase}
        className="a2h-lg-sheet"
        onAnimationEnd={handleSheetAnimationEnd}
      >
        {/* iOS-style grabber */}
        <div className="a2h-lg-handle" aria-hidden="true" />

        {/* Header */}
        <div className="a2h-lg-divider a2h-lg-header flex items-center border-b px-4 py-2.5">
          <h2
            id={titleId}
            style={{ color: "var(--a2h-ios-label)", fontSize: "17px", fontWeight: 600, letterSpacing: "-0.02em" }}
          >
            Install {displayTitle}
          </h2>
          <button type="button" onClick={handleClose} className="a2h-lg-close" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[62vh] space-y-3 overflow-y-auto px-4 py-3">
          {/* App Info Section */}
          <div className="a2h-lg-card flex items-center gap-2.5">
            {appInfo?.iconUrl != null && appInfo.iconUrl !== "" ?
              <img src={appInfo.iconUrl} alt="App icon" className="a2h-lg-app-icon" />
            : <DefaultAppIcon className="a2h-lg-app-icon" />}
            <div className="min-w-0 flex-1">
              <h3 className="a2h-app-title truncate">{displayTitle}</h3>
              <p id={descId} className="a2h-app-description mt-0.5 line-clamp-2">
                {displayDescription}
              </p>
            </div>
          </div>

          {/* Media Section */}
          {media && (
            <div className="overflow-hidden rounded-xl" style={{ background: "var(--a2h-ios-bg)" }}>
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
          <div>
            <h3
              style={{
                color: "var(--a2h-ios-label-secondary)",
                fontSize: "12px",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                marginBottom: "8px",
              }}
            >
              How to Install
            </h3>
            <div className="a2h-lg-card a2h-lg-list-card">
              {steps.map((step, index) => {
                const IconComponent = step.icon != null ? StepIcons[step.icon] : undefined;
                return (
                  <div key={step.title} className="a2h-step a2h-lg-step">
                    <span className="a2h-lg-step-number">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {IconComponent != null && (
                          <span style={{ color: "var(--a2h-ios-blue)" }}>
                            <IconComponent />
                          </span>
                        )}
                        <span
                          style={{
                            color: "var(--a2h-ios-label)",
                            fontSize: "14px",
                            fontWeight: 500,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {step.title}
                        </span>
                      </div>
                      {step.description != null && step.description !== "" && (
                        <p
                          style={{
                            color: "var(--a2h-ios-label-secondary)",
                            fontSize: "12px",
                            marginTop: "2px",
                            lineHeight: 1.4,
                          }}
                        >
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="a2h-lg-divider border-t px-4 py-3">
          <button type="button" onClick={handleClose} className="a2h-lg-button">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
