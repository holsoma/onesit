import js from "@eslint/js";
import tseslint from "typescript-eslint";
export default tseslint.config(
  {
    ignores: [
      "dist",
      ".starter",
      "node_modules",
      ".shots",
      "test-results",
      "playwright-report",
      "scripts",
      "tests",
      "eslint.config.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
