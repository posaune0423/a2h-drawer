import { fireEvent, render } from "@testing-library/react";
import { describe, expect, mock, test } from "bun:test";
import { A2HInstallModal } from "../../src/components/A2HInstallModal.tsx";

describe("A2HInstallModal", () => {
  const defaultProps = {
    open: true,
    onOpenChange: mock(() => {}),
  };

  describe("visibility", () => {
    test("renders when open is true", () => {
      const { getByRole } = render(<A2HInstallModal {...defaultProps} />);

      expect(getByRole("dialog")).toBeDefined();
    });

    test("does not render when open is false", () => {
      const { queryByRole } = render(<A2HInstallModal {...defaultProps} open={false} />);

      expect(queryByRole("dialog")).toBeNull();
    });

    test("keeps rendering during close animation until it ends", () => {
      const { getByRole, queryByRole, rerender } = render(<A2HInstallModal {...defaultProps} open={true} />);

      // Trigger close (open -> false). Modal should remain mounted to allow exit animation.
      rerender(<A2HInstallModal {...defaultProps} open={false} />);
      expect(getByRole("dialog")).toBeDefined();

      // When the sheet animation finishes, it should unmount.
      fireEvent.animationEnd(getByRole("dialog"));
      expect(queryByRole("dialog")).toBeNull();
    });
  });

  describe("app info display", () => {
    test("displays app title", () => {
      const { getByText } = render(
        <A2HInstallModal
          {...defaultProps}
          appInfo={{
            title: "Test App",
            description: null,
            iconUrl: null,
          }}
        />,
      );

      expect(getByText("Test App")).toBeDefined();
    });

    test("displays app description", () => {
      const { getByText } = render(
        <A2HInstallModal
          {...defaultProps}
          appInfo={{
            title: null,
            description: "This is a test description",
            iconUrl: null,
          }}
        />,
      );

      expect(getByText("This is a test description")).toBeDefined();
    });

    test("displays app icon when provided", () => {
      const { getByRole } = render(
        <A2HInstallModal
          {...defaultProps}
          appInfo={{
            title: "Test App",
            description: null,
            iconUrl: "/test-icon.png",
          }}
        />,
      );

      const icon = getByRole("img", { name: /app icon/i });
      expect(icon.getAttribute("src")).toBe("/test-icon.png");
    });

    test("shows fallback when title is missing", () => {
      const { getByRole } = render(
        <A2HInstallModal
          {...defaultProps}
          appInfo={{
            title: null,
            description: null,
            iconUrl: null,
          }}
        />,
      );

      // Should show the fallback "Install App" title in the app info section
      const appTitle = getByRole("heading", { level: 3, name: "Install App" });
      expect(appTitle).toBeDefined();
    });
  });

  describe("instruction steps", () => {
    test("displays default instruction steps", () => {
      const { getByText } = render(<A2HInstallModal {...defaultProps} />);

      // Default steps should include Share and Add to Home Screen step titles
      expect(getByText("Share")).toBeDefined();
      expect(getByText("Add to Home Screen")).toBeDefined();
    });

    test("displays custom steps when provided", () => {
      const { getByText } = render(
        <A2HInstallModal
          {...defaultProps}
          steps={[
            { title: "Step 1", description: "Do this first" },
            { title: "Step 2", description: "Then do this" },
          ]}
        />,
      );

      expect(getByText("Step 1")).toBeDefined();
      expect(getByText("Do this first")).toBeDefined();
      expect(getByText("Step 2")).toBeDefined();
    });
  });

  describe("close functionality", () => {
    test("calls onOpenChange(false) when close button is clicked", () => {
      const onOpenChange = mock(() => {});
      const { getByRole } = render(<A2HInstallModal open={true} onOpenChange={onOpenChange} />);

      const closeButton = getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    test("calls onOpenChange(false) when backdrop is clicked", () => {
      const onOpenChange = mock(() => {});
      const { getByTestId } = render(<A2HInstallModal open={true} onOpenChange={onOpenChange} />);

      const backdrop = getByTestId("modal-backdrop");
      fireEvent.click(backdrop);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("media display", () => {
    test("displays image media when provided", () => {
      const { getByRole } = render(
        <A2HInstallModal
          {...defaultProps}
          media={{
            kind: "image",
            src: "/instruction.png",
            alt: "Installation guide",
          }}
        />,
      );

      const image = getByRole("img", { name: "Installation guide" });
      expect(image.getAttribute("src")).toBe("/instruction.png");
    });

    test("displays video media when provided", () => {
      const { getByTestId } = render(
        <A2HInstallModal
          {...defaultProps}
          media={{
            kind: "video",
            src: "/instruction.mp4",
          }}
        />,
      );

      const video = getByTestId("instruction-video");
      expect(video.getAttribute("src")).toBe("/instruction.mp4");
    });
  });

  describe("accessibility", () => {
    test("has proper aria attributes", () => {
      const { getByRole } = render(<A2HInstallModal {...defaultProps} />);

      const dialog = getByRole("dialog");
      expect(dialog.getAttribute("aria-modal")).toBe("true");
      expect(dialog.getAttribute("aria-labelledby")).toBeDefined();
    });

    test("close button has accessible name", () => {
      const { getByRole } = render(<A2HInstallModal {...defaultProps} />);

      const closeButton = getByRole("button", { name: /close/i });
      expect(closeButton).toBeDefined();
    });
  });
});
