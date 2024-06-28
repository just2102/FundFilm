module.exports = {
  extends: [
    "prettier",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],

  parser: "@typescript-eslint/parser",
  // Tells ESLint to use this parser installed at previous step
  plugins: ["unused-imports", "import", "prettier"],
  parserOptions: {
    ecmaVersion: 2021,
    // The version of ECMAScript you are using
    sourceType: "module",
    // Enables ECMAScript modules
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    // This is where you can disable/customize some of the rules specified by the plugins
    // suppress errors for missing 'import React' in files
    "react/react-in-jsx-scope": "off",
    //should add ".ts" if typescript project
    "react/no-unescaped-entities": [
      "warn",
      {
        forbid: [">", "}"],
      },
    ],
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
    eqeqeq: ["warn", "always"],
    "newline-before-return": ["warn"],
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/ban-ts-comment": 0,

    "@typescript-eslint/ban-types": [
      "error",
      {
        extendDefaults: true,
        types: {
          "{}": false,
        },
      },
    ],
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "off",

    /*
      Enforce a convention in module import order
      https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    */
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "sibling"],
        pathGroups: [
          {
            pattern: "react-**",
            group: "builtin",
          },
          {
            pattern: "react",
            group: "builtin",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
};
