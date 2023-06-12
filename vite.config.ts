import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";
import { vitePluginGraphqlLoader } from "vite-plugin-graphql-loader";

export default defineConfig({
  plugins: [sveltekit(), vitePluginGraphqlLoader()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"]
  },
  optimizeDeps: {
    exclude: ["@urql/svelte"]
  }
});
