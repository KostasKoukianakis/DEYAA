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
    // Optimize CSS chunking - split CSS into separate chunks for better caching
    cssCodeSplit: true,
    // Optimize assets - inline small assets, externalize larger ones
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    rollupOptions: {
      output: {
        // Optimize chunk names for better caching and loading
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Code splitting strategy for optimal performance
        manualChunks: (id) => {
          // React core - MUST be loaded first (includes react, react-dom, react-router-dom)
          if (
            id.includes('react/') ||
            id.includes('react-dom/') ||
            id.includes('react-router') ||
            id.includes('scheduler/')
          ) {
            return 'react-vendor';
          }

          // React-leaflet depends on React, so it must be in react-vendor
          if (id.includes('react-leaflet')) {
            return 'react-vendor';
          }

          // Leaflet (non-React) - only for NetworkMap (lazy loaded)
          if (id.includes('leaflet')) {
            return 'map-vendor';
          }

          // React-dependent libraries - must load after React
          // UI libraries that depend on React
          if (id.includes('@radix-ui')) {
            return 'ui-vendor';
          }

          // Query library (depends on React)
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }

          // Form libraries (depend on React)
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'form-vendor';
          }

          // Date and utility libraries
          if (id.includes('date-fns')) {
            return 'date-vendor';
          }

          // Chart library
          if (id.includes('recharts')) {
            return 'chart-vendor';
          }

          // Icon libraries
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }

          // Supabase
          if (id.includes('@supabase')) {
            return 'supabase-vendor';
          }

          // Other React-dependent libraries
          if (
            id.includes('sonner') ||
            id.includes('next-themes') ||
            id.includes('embla-carousel') ||
            id.includes('cmdk') ||
            id.includes('vaul') ||
            id.includes('react-day-picker') ||
            id.includes('react-resizable-panels') ||
            id.includes('input-otp') ||
            id.includes('class-variance-authority') ||
            id.includes('clsx') ||
            id.includes('tailwind-merge') ||
            id.includes('tailwindcss-animate')
          ) {
            return 'react-vendor';
          }

          // Split large pages into separate chunks
          if (id.includes('pages/')) {
            // Dashboard pages - split each major dashboard component
            if (id.includes('pages/dashboard/')) {
              if (id.includes('Dashboard')) return 'dashboard-main';
              if (id.includes('PostsManagement')) return 'dashboard-posts';
              if (id.includes('ProblemsManagement')) return 'dashboard-problems';
              if (id.includes('SubscribersManagement')) return 'dashboard-subscribers';
              if (id.includes('NotificationsManagement')) return 'dashboard-notifications';
              if (id.includes('Settings')) return 'dashboard-settings';
              return 'dashboard-layout';
            }
            // Large individual pages
            if (id.includes('NetworkMap')) {
              return 'network-map';
            }
            if (id.includes('ForCitizens')) {
              return 'for-citizens';
            }
            if (id.includes('BillCalculator')) {
              return 'bill-calculator';
            }
            if (id.includes('ProblemReporting')) {
              return 'problem-reporting';
            }
            if (id.includes('Announcements')) {
              return 'announcements';
            }
            if (id.includes('Tenders')) {
              return 'tenders';
            }
            if (id.includes('EServices')) {
              return 'e-services';
            }
            // Group smaller pages
            return 'pages';
          }

          // Components
          if (id.includes('components/')) {
            // UI components (shared across pages)
            if (id.includes('components/ui/')) {
              return 'ui-components';
            }
            // Layout components (header, footer)
            if (id.includes('components/layout/')) {
              return 'layout';
            }
            // Other components
            return 'components';
          }

          // Utilities and libraries
          if (id.includes('lib/') || id.includes('utils')) {
            return 'utils';
          }

          // Other non-React vendors
          return 'vendor';
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable tree shaking
    minify: 'esbuild',
    // Source maps for production debugging (optional, can disable for smaller size)
    sourcemap: false,
  },
}));
