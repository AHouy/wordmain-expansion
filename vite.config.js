import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/wordmain-expansion/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
