import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const isTestMode = mode === "test";

  return {
    base: "/",
    plugins: [
      react({
        babel: {
          plugins: isTestMode ? [] : ["babel-plugin-react-compiler"],
        },
      }),
      tailwindcss(),
    ],

    test: {
      globals: false,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",

      coverage: {
        provider: "istanbul",
        enabled: true,
        reporter: ["text", "html"],

        exclude: [
          "coverage/**",
          "dist/**",
          "**/*.config.js",
          "**/*.config.ts",
          "src/setupTests.ts",
          "**/*.test.tsx",
          "**/*.test.ts",
          "**/*.styled.tsx",
          "**/*.styled.ts",
          "src/models/**",
          "src/main.tsx",
          "src/vite-env.d.ts",
          "src/constants/**",
          "src/context/**",
          "src/token/**",
          "src/api/**",
        ],
      },
    },

    server: {
      port: 5173,
      strictPort: true,
    },
  };
});
