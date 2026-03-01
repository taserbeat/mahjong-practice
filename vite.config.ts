import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isProduction = process.env.NODE_ENV === "production";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isProduction ? "/mahjong-practice/" : "/",
  server: {
    port: 3000,
    host: "0.0.0.0",
    open: false, // package.jsonのscriptでブラウザ自動起動を切り替えるので、ここではfalseにする
    proxy: {},
  },
  build: {
    outDir: "build",
  },
});
