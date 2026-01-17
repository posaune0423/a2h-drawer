import type { ReactNode } from "react";

/**
 * Icon components for A2H Drawer
 */

interface IconProps {
  className?: string;
}

/**
 * Share icon (iOS share button style)
 */
export function ShareIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M8.59 13.51l6.83 3.98m-.01-10.98l-6.82 3.98M21 5a3 3 0 11-6 0 3 3 0 016 0zM9 12a3 3 0 11-6 0 3 3 0 016 0zm12 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

/**
 * Plus/More icon
 */
export function PlusIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14m-7-7h14" />
    </svg>
  );
}

/**
 * Home icon (Add to Home Screen)
 */
export function HomeIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

/**
 * Close icon (X button)
 */
export function CloseIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="2">
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/**
 * Default app icon placeholder
 */
export function DefaultAppIcon({ className = "h-16 w-16" }: IconProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-1/2 w-1/2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

/**
 * Step icon registry - maps icon names to components
 */
export const StepIcons: Record<string, () => ReactNode> = {
  share: () => <ShareIcon />,
  more: () => <PlusIcon />,
  add: () => <HomeIcon />,
};
