import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, test } from "bun:test";
import { A2HDrawer, A2HDrawerProvider, useA2HDrawer } from "../../src/index.ts";

/**
 * Integration test component that uses the hook to control the drawer
 */
function TestApp() {
  const { open, isOpen } = useA2HDrawer();

  return (
    <div>
      <button onClick={open} data-testid="install-button">
        Install
      </button>
      <span data-testid="open-state">{isOpen ? "open" : "closed"}</span>
    </div>
  );
}

describe("A2HDrawer Integration", () => {
  describe("Provider + Hook + Modal integration", () => {
    test("clicking Install opens the modal", async () => {
      const { getByTestId, getByRole } = render(
        <A2HDrawerProvider>
          <TestApp />
          <A2HDrawer />
        </A2HDrawerProvider>,
      );

      // Initially closed
      expect(getByTestId("open-state").textContent).toBe("closed");

      // Click Install button
      fireEvent.click(getByTestId("install-button"));

      // Modal should be visible
      await waitFor(() => {
        expect(getByTestId("open-state").textContent).toBe("open");
        expect(getByRole("dialog")).toBeDefined();
      });
    });

    test("clicking close button closes the modal", async () => {
      const { getByTestId, getByRole, queryByRole } = render(
        <A2HDrawerProvider>
          <TestApp />
          <A2HDrawer />
        </A2HDrawerProvider>,
      );

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        expect(getByRole("dialog")).toBeDefined();
      });

      // Click close button
      const closeButton = getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      // Simulate end of exit animation (tests don't run real CSS animations)
      fireEvent.animationEnd(getByRole("dialog"));

      // Modal should be closed
      await waitFor(() => {
        expect(queryByRole("dialog")).toBeNull();
        expect(getByTestId("open-state").textContent).toBe("closed");
      });
    });

    test("clicking backdrop closes the modal", async () => {
      const { getByTestId, getByRole, queryByRole } = render(
        <A2HDrawerProvider>
          <TestApp />
          <A2HDrawer />
        </A2HDrawerProvider>,
      );

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        expect(getByRole("dialog")).toBeDefined();
      });

      // Click backdrop
      const backdrop = getByTestId("modal-backdrop");
      fireEvent.click(backdrop);

      // Simulate end of exit animation (tests don't run real CSS animations)
      fireEvent.animationEnd(getByRole("dialog"));

      // Modal should be closed
      await waitFor(() => {
        expect(queryByRole("dialog")).toBeNull();
      });
    });

    test("displays app info when provided", async () => {
      const { getByTestId, getByText } = render(
        <A2HDrawerProvider>
          <TestApp />
          <A2HDrawer
            appInfo={{
              title: "My Test App",
              description: "A great test application",
              iconUrl: "/test-icon.png",
            }}
          />
        </A2HDrawerProvider>,
      );

      // Open the modal
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        expect(getByText("My Test App")).toBeDefined();
        expect(getByText("A great test application")).toBeDefined();
      });
    });
  });

  describe("Multiple hooks work with same provider", () => {
    function SecondTrigger() {
      const { toggle } = useA2HDrawer();
      return (
        <button onClick={toggle} data-testid="toggle-button">
          Toggle
        </button>
      );
    }

    test("multiple components can control the same drawer", async () => {
      const { getByTestId, getByRole, queryByRole } = render(
        <A2HDrawerProvider>
          <TestApp />
          <SecondTrigger />
          <A2HDrawer />
        </A2HDrawerProvider>,
      );

      // Open via first component
      fireEvent.click(getByTestId("install-button"));

      await waitFor(() => {
        expect(getByRole("dialog")).toBeDefined();
      });

      // Close via second component
      fireEvent.click(getByTestId("toggle-button"));

      // Simulate end of exit animation (tests don't run real CSS animations)
      fireEvent.animationEnd(getByRole("dialog"));

      await waitFor(() => {
        expect(queryByRole("dialog")).toBeNull();
      });
    });
  });
});
