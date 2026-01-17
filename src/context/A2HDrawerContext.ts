import { createContext } from "react";
import type { A2HDrawerController, A2HDrawerOpenReason } from "../types.ts";

/**
 * Default no-op controller for when Provider is not present
 */
const defaultController: A2HDrawerController = {
  isOpen: false,
  open: (_reason?: A2HDrawerOpenReason) => {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[a2h-drawer] useA2HDrawer was called without A2HDrawerProvider. " +
          "Wrap your app with <A2HDrawerProvider> to enable the drawer.",
      );
    }
  },
  close: () => {},
  toggle: () => {},
};

/**
 * Context for A2H Drawer state management
 * Provides default no-op controller when Provider is not present
 */
export const A2HDrawerContext = createContext<A2HDrawerController>(defaultController);
