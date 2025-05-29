import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,

    // ← Add this proxy block
    proxy: {
      // Proxy only the OAuth start endpoints and your /me endpoint:
      // This makes https://calroute.online/login/google forward to https://calroute.online/login/google
      "/login/google": {
        target: "https://calroute.online",
        changeOrigin: true,
        secure: true,
      },
      "/login/todoist": {
        target: "https://calroute.online",
        changeOrigin: true,
        secure: true,
      },
      "/me": {
        target: "https://calroute.online",
        changeOrigin: true,
        secure: true,
      },
      // If you have logout or other API paths, add them here:
      // "/logout": { target: "https://calroute.online", changeOrigin: true, secure: true },
    },
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));