/** @type {import("prettier").Config} */
const config = {
    plugins: [require.resolve("prettier-plugin-tailwindcss")],

    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: false,
    singleQuote: false,
    quoteProps: "consistent",
    jsxSingleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    bracketSameLine: true,
    arrowParens: "always",
};

module.exports = config;
