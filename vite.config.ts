import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin as remixCloudflareDevProxy,
} from '@remix-run/dev';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
      polyfills: ['es/object/has-own'],
      modernPolyfills: ['es/object/has-own'],
    }),
    remixCloudflareDevProxy(),
    remix({
      ssr: true,
      future: {
        // v3_lazyRouteDiscovery: true,
        unstable_optimizeDeps: true,
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    target: 'es2015',
    minify: true,
    cssMinify: true,
  },
});
