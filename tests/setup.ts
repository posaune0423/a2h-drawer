import { JSDOM } from "jsdom";
import "@testing-library/jest-dom";

// Setup DOM environment for testing
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
  resources: "usable",
});

// Setup global DOM objects
global.window = dom.window as unknown as Window & typeof globalThis;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.location = dom.window.location;

// Setup additional global objects needed for testing
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }) as MediaQueryList;
}

// Mock BeforeInstallPromptEvent
global.BeforeInstallPromptEvent = class extends Event {
  readonly platforms: ReadonlyArray<string> = ["web"];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }> = Promise.resolve({
    outcome: "accepted",
    platform: "web",
  });

  prompt(): Promise<void> {
    return Promise.resolve();
  }
} as unknown as typeof BeforeInstallPromptEvent;

// Setup fetch mock
global.fetch = () =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response);
