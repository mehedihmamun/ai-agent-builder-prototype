import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:share` (mode "share") bundles everything into one HTML file that opens from disk.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), ...(mode === "share" ? [viteSingleFile()] : [])],
  build: { target: "es2022", ...(mode === "share" ? { outDir: "dist-share" } : {}) },
  esbuild: { target: "es2022" },
  optimizeDeps: { esbuildOptions: { target: "es2022" } },
}));
