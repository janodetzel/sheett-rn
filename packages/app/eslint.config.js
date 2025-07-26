// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const drizzle = require("eslint-plugin-drizzle");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    plugins: { drizzle },
    rules: {
      ...drizzle.configs.recommended.rules,
    },
  },
]);
