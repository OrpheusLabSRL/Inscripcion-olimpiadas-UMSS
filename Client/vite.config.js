import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  assetsInclude: ["**/*.xlsx"],
  server: {
    fs: {
      strict: false,
    },
    proxy: {
      "/api": {
        target: "http://orpheus.tis.cs.umss.edu.bo",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
