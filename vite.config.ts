import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Bundle analyzer (optional - uncomment to analyze bundle size)
// import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/send-email': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure(proxy) {
          proxy.on("error", (_err, _req, res) => {
            if ("headersSent" in res && !res.headersSent) {
              res.writeHead(503, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: false,
                  message:
                    "Email server is not running. Start it with npm run email:server",
                }),
              );
            }
          });
        },
      },
      "/api/health": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (
            id.includes("@shadergradient") ||
            id.includes("@react-three") ||
            id.includes("/three/") ||
            id.includes("\\three\\")
          ) {
            return "shader-vendor";
          }

          if (id.includes("@supabase")) return "supabase-vendor";
          if (id.includes("date-fns")) return "date-vendor";
          if (id.includes("leaflet")) return "map-vendor";

          // Keep the React ecosystem in one chunk to avoid circular init errors.
          if (
            id.includes("react") ||
            id.includes("scheduler") ||
            id.includes("@radix-ui") ||
            id.includes("@tanstack") ||
            id.includes("lucide-react") ||
            id.includes("recharts") ||
            id.includes("sonner") ||
            id.includes("embla-carousel") ||
            id.includes("cmdk") ||
            id.includes("vaul") ||
            id.includes("react-day-picker") ||
            id.includes("react-resizable-panels") ||
            id.includes("input-otp") ||
            id.includes("next-themes") ||
            id.includes("@hookform") ||
            id.includes("react-hook-form") ||
            id.includes("gsap") ||
            id.includes("lenis") ||
            id.includes("@tiptap")
          ) {
            return "react-vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1600,
    minify: "esbuild",
    sourcemap: false,
  },
}));
