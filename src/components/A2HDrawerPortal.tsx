import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface A2HDrawerPortalProps {
  children: React.ReactNode;
  containerId?: string;
}

/**
 * Portal component for rendering the A2H drawer modal at the document body level
 *
 * This ensures the modal is rendered outside the app's component hierarchy
 * and appears above all other content.
 *
 * @example
 * ```tsx
 * <A2HDrawerPortal>
 *   <A2HInstallModal open={isOpen} onOpenChange={setIsOpen} />
 * </A2HDrawerPortal>
 * ```
 */
export function A2HDrawerPortal({ children, containerId = "a2h-drawer-portal" }: A2HDrawerPortalProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof document === "undefined") return;

    // Try to find existing container
    let element = document.getElementById(containerId);

    // Create container if it doesn't exist
    if (!element) {
      element = document.createElement("div");
      element.id = containerId;
      document.body.appendChild(element);
    }

    setContainer(element);

    // Cleanup function - only remove if we created it
    return () => {
      // Don't remove the container on cleanup as other portals might use it
    };
  }, [containerId]);

  // Don't render anything during SSR or until container is ready
  if (!container) return null;

  return createPortal(children, container);
}
