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
      // This makes http://localhost:8080/login/google  forward to  http://localhost:8888/login/google
      "/login/google": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false,
      },
      "/login/todoist": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false,
      },
      "/me": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false,
      },
      // If you have logout or other API paths, add them here:
      // "/logout": { target: "http://localhost:8888", changeOrigin: true, secure: false },
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