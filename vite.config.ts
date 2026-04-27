import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite", "@electric-sql/pglite-postgis"],
  },
  base: "",
  assetsInclude: ["src/assets/*.gz"],
  worker: {
    format: "es",
  },
});
