import { A2HDrawer, A2HDrawerProvider, useA2HDrawer, useA2HEnvironment, useHostAppInfo } from "../../../src/index.ts";

/**
 * Install button component that shows/hides based on environment
 */
function InstallButton() {
  const { isIOSBrowser, isStandalone } = useA2HEnvironment();
  const { open, isOpen } = useA2HDrawer();

  // Show on non-iOS for demo purposes, but in production you'd want:
  // if (!isIOSBrowser || isStandalone) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={open}
        disabled={isOpen}
        className="rounded-xl bg-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-600 active:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        data-testid="install-button"
      >
        Install App
      </button>

      <div className="space-y-1 text-xs text-gray-500">
        <p>
          iOS Browser:{" "}
          <span className={isIOSBrowser ? "text-green-600" : "text-gray-400"}>{isIOSBrowser ? "Yes" : "No"}</span>
        </p>
        <p>
          Standalone:{" "}
          <span className={isStandalone ? "text-green-600" : "text-gray-400"}>{isStandalone ? "Yes" : "No"}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Display auto-detected app info for debugging
 */
function AppInfoDisplay() {
  const appInfo = useHostAppInfo();

  return (
    <div className="space-y-2 rounded-xl bg-gray-50 p-4">
      <h3 className="font-medium text-gray-700">Auto-detected App Info:</h3>
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="w-24 text-gray-500">Title:</dt>
          <dd className="text-gray-900">{appInfo.title ?? "(not found)"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 text-gray-500">Description:</dt>
          <dd className="line-clamp-2 text-gray-900">{appInfo.description ?? "(not found)"}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-24 text-gray-500">Icon URL:</dt>
          <dd className="break-all text-gray-900">{appInfo.iconUrl ?? "(not found)"}</dd>
        </div>
      </dl>
      {appInfo.iconUrl != null && (
        <img
          src={appInfo.iconUrl}
          alt="App icon"
          className="h-16 w-16 rounded-2xl shadow"
          data-testid="detected-icon"
        />
      )}
    </div>
  );
}

/**
 * Main App component
 */
export function App() {
  return (
    <A2HDrawerProvider>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header */}
        <header className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">A2H Drawer Example</h1>
          <p className="mt-2 text-gray-600">iOS PWA "Add to Home Screen" instruction drawer</p>
        </header>

        {/* Main content */}
        <main className="mx-auto max-w-md space-y-8 px-4 py-8">
          {/* Install section */}
          <section className="text-center">
            <InstallButton />
          </section>

          {/* App Info Debug */}
          <section>
            <AppInfoDisplay />
          </section>

          {/* Customization examples */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Customization Examples</h2>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                The <code className="rounded bg-gray-100 px-1">A2HDrawer</code> component can be customized with:
              </p>
              <ul className="ml-2 list-inside list-disc space-y-1">
                <li>Custom app info (title, description, icon)</li>
                <li>Media (image or video) for instructions</li>
                <li>Custom instruction steps</li>
              </ul>
            </div>
          </section>
        </main>

        {/* A2H Drawer - renders the modal */}
        <A2HDrawer
          // Optional: override auto-detected app info
          // appInfo={{ title: "Custom Title" }}
          // Optional: add instruction media
          media={{
            kind: "image",
            src: "/instruction.svg",
            alt: "How to add to home screen",
          }}
        />
      </div>
    </A2HDrawerProvider>
  );
}
