import globals from "globals";
import tseslint from "typescript-eslint";
import js from '@eslint/js'
import tsParser from "@typescript-eslint/parser"
import unusedImports from "eslint-plugin-unused-imports"
import airbnbBase from "eslint-config-airbnb-base"
import airbnbBaseTypescript from "eslint-config-airbnb-base-typescript"

/** @type {import('eslint').Linter.Config[]} */
export default [ 
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node // de esta manera sabe lo que es process.env
      }
    },
    plugins: { // agrega reglas
    "@typescript": tseslint,
    "unused-imports": unusedImports
    },
    rules: {
      ...airbnbBase.rules,
      ...airbnbBaseTypescript.rules,
      "no-unused-vars": "off", // Permite crear variables sin usarse, las cuales se podrian con variables que llevan _variable, se quta el error
      "unused-imports/no-unused-vars": [
        "warn", // le decimos que advierta solamente sobre el error
        {
          vars: "all",
          varsIgnorePattern: "^_", // Ignorara las variables que incien con _
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        }
      ]
    },
  settings: {
    "import/resolve": {
      node : {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  } }
];