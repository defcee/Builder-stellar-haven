import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["server/**/*.test.ts", "src/**/*.test.tsx"],
    fileParallelism: false,
    maxWorkers: 1,
    coverage: {
      provider: "v8",
      include: [
        "server/routes/auth.ts",
        "server/routes/marketplace.ts",
        "src/pages/Auth.tsx",
        "src/pages/Profile.tsx",
      ],
      reporter: ["text", "lcov"],
      thresholds: { lines: 50 },
    },
  },
});
