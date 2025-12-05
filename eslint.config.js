const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: "module"
            }
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            "prettier": prettierPlugin
        },
        rules: {
            ...typescriptEslint.configs.recommended.rules,
            "prettier/prettier": "error",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
        }
    }
];
