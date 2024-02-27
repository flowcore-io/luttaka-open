/** @type {import("next").NextConfig} */

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    // disable: false,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true
    }
})

const removeImports = require("next-remove-imports")();

const nextConfig = {};

module.exports = withPWA(removeImports(nextConfig));
