import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // bpmn-js and the enabled plugins are intentionally bundled into the workbench.
    // Keep the warning threshold explicit until the project introduces route-level lazy loading.
    chunkSizeWarningLimit: 1800,
  },
});
