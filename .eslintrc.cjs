module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:astro/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },

  // Global rules
  rules: {
    // Example global rules (applies to all files):
    quotes: ["error", "double"], // Enforces double quotes globally
    semi: ["error", "never"], // Disallows semicolons globally

    // Add more global rules here
  },

  // File-specific overrides
  overrides: [
    {
      // Rules for `.astro` files
      files: ["*.astro"],
      plugins: ["astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
        sourceType: "module",
      },
      rules: {
        // Astro-specific rules
        "astro/no-conflict-set-directives": "error",
        "astro/no-unused-define-vars-in-style": "error",

        // Custom rules for `.astro` files
        quotes: ["error", "double"], // Enforces double quotes in .astro files
        semi: ["error", "never"], // Disallows semicolons in .astro files

        // Add more .astro-specific rules here
      },
    },
    {
      // Rules for `<script>` tag in `.astro` files (JavaScript)
      files: ["**/*.astro/*.js", "*.astro/*.js"],
      env: {
        browser: true,
        es2020: true,
      },
      parserOptions: {
        sourceType: "module",
      },
      rules: {
        // Add custom rules for <script> tags in .astro files
        quotes: ["error", "double"], // Enforces double quotes in script tags
        semi: ["error", "never"], // Disallows semicolons in script tags

        // Disable Prettier inside script tags if needed
        "prettier/prettier": "off",
      },
    },
    {
      // Rules for `<script>` tag in `.astro` files (TypeScript)
      files: ["**/*.astro/*.ts", "*.astro/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        sourceType: "module",
        project: null,
      },
      rules: {
        // Add custom rules for TypeScript inside .astro files
        quotes: ["error", "double"], // Enforces double quotes in TypeScript script tags
        semi: ["error", "never"], // Disallows semicolons in TypeScript script tags

        // Disable Prettier inside TypeScript script tags if needed
        "prettier/prettier": "off",
      },
    },
  ],
}
