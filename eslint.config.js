
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    {
        ignores: ["node_modules/**", "public/js/md5.js"]
    },
    {
        files: ["public/js/code.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",
            globals: globals.browser
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "off",
            "no-dupe-keys": "off"
        }
    }
];