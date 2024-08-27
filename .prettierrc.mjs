/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  singleQuote: false,
  semi: false,
  printWidth: 80,
  jsxSingleQuote: false,
  bracketSameLine: false,
  arrowParens: "avoid",
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
}
