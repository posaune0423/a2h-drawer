import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { App } from "../src/App.tsx";

describe("Example App", () => {
  beforeEach(() => {
    // Set up document metadata for testing
    document.title = "A2H Drawer Example";

    const descMeta = document.createElement("meta");
    descMeta.setAttribute("name", "description");
    descMeta.setAttribute("content", "Example PWA demonstrating the a2h-drawer library.");
    document.head.appendChild(descMeta);

    const iconLink = document.createElement("link");
    iconLink.setAttribute("rel", "icon");
    iconLink.setAttribute("href", "/icon.svg");
    document.head.appendChild(iconLink);

    const appleIconLink = document.createElement("link");
    appleIconLink.setAttribute("rel", "apple-touch-icon");
    appleIconLink.setAttribute("href", "/icon-180.svg");
    document.head.appendChild(appleIconLink);
  });

  afterEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  describe("Modal open/close flow (Requirement 9.5)", () => {
    test("clicking Install button opens the modal", async () => {
      const { getByTestId, getByRole } = render(<App />);

      const installButton = getByTestId("install-button");
      fireEvent.click(installButton);

      await waitFor(() => {
        expect(getByRole("dialog")).toBeDefined();
      });
    });

    test("clicking close button closes the modal", async () => {
      const { getByTestId, getByRole, queryByRole } = render(<App />);

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        expect(getByRole("dialog")).toBeDefined();
      });

      // Click close button
      const closeButton = getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(queryByRole("dialog")).toBeNull();
      });
    });

    test('clicking "Got it" button closes the modal', async () => {
      const { getByTestId, getByRole, queryByRole } = render(<App />);

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        expect(getByRole("dialog")).toBeDefined();
      });

      // Click "Got it" button
      const gotItButton = getByRole("button", { name: /got it/i });
      fireEvent.click(gotItButton);

      await waitFor(() => {
        expect(queryByRole("dialog")).toBeNull();
      });
    });
  });

  describe("App info display (Requirement 9.6, 9.7)", () => {
    test("displays auto-detected title in modal", async () => {
      const { getByTestId, getByRole, container } = render(<App />);

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        // Title should be displayed in the modal's app-title element
        const dialog = getByRole("dialog");
        const appTitle = dialog.querySelector(".a2h-app-title");
        expect(appTitle?.textContent).toBe("A2H Drawer Example");
      });
    });

    test("displays auto-detected description in modal", async () => {
      const { getByTestId, getByRole } = render(<App />);

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        // Description should be displayed in the modal
        const dialog = getByRole("dialog");
        const appDesc = dialog.querySelector(".a2h-app-description");
        expect(appDesc?.textContent).toContain("Example PWA demonstrating");
      });
    });

    test("displays auto-detected icon in app info section", () => {
      const { getByTestId } = render(<App />);

      // The app info display shows the detected icon
      const detectedIcon = getByTestId("detected-icon");
      expect(detectedIcon).toBeDefined();
      expect(detectedIcon.getAttribute("src")).toBe("/icon-180.svg");
    });
  });

  describe("Instruction steps display", () => {
    test("displays instruction steps", async () => {
      const { getByTestId, getByRole } = render(<App />);

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        // Look inside the dialog for steps (modal is in a portal)
        const dialog = getByRole("dialog");
        const steps = dialog.querySelectorAll(".a2h-step");
        expect(steps.length).toBeGreaterThan(0);
      });
    });

    test("displays instruction media when configured", async () => {
      const { getByTestId, getByRole } = render(<App />);

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        // The example app configures an image media
        const instructionImage = getByRole("img", { name: /how to add to home screen/i });
        expect(instructionImage).toBeDefined();
        expect(instructionImage.getAttribute("src")).toBe("/instruction.svg");
      });
    });
  });

  describe("Environment detection display", () => {
    test("shows iOS browser status", () => {
      const { getByText } = render(<App />);

      // Should show iOS Browser status (No in test environment)
      expect(getByText(/iOS Browser:/)).toBeDefined();
    });

    test("shows standalone status", () => {
      const { getByText } = render(<App />);

      // Should show Standalone status
      expect(getByText(/Standalone:/)).toBeDefined();
    });
  });
});
