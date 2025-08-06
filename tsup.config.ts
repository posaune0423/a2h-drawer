import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  minify: true,
  external: ["react", "react-dom", "@radix-ui/react-dialog", "@radix-ui/react-slot", "tailwindcss"],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  onSuccess: async () => {
    console.log("✅ Build completed successfully!");
  },
});
