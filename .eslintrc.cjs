/* eslint-env node */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    plugins: ["@typescript-eslint"],
    root: true,
    overrides: [
        {
            extends: ["plugin:@typescript-eslint/disable-type-checked"],
            files: ["*.js", "*.cjs"],
        },
        // {
        //     extends: [
        //         'plugin:@typescript-eslint/recommended-requiring-type-checking',
        //     ],
        //     files: ['./**/*.{ts,tsx}'],
        // }
    ],
    rules: {
        "@typescript-eslint/no-misused-promises": ["error", {checksVoidReturn: false}],
    },
};
