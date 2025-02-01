const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_BUILD,
} = require("next/constants");

/** @type {(phase: string, defaultConfig: import("next").NextConfig) => Promise<import("next").NextConfig>} */
module.exports = async (phase) => {
    /** @type {import("next").NextConfig} */

    // Your current or future configuration

    const revision = crypto.randomUUID();
    const nextConfig = {
        reactStrictMode: true,};

    if (
        phase === PHASE_DEVELOPMENT_SERVER ||
        phase === PHASE_PRODUCTION_BUILD
    ) {
        const withSerwist = (await import("@serwist/next")).default({
            swSrc: "src/service-worker/app-worker.ts",
            swDest: "public/sw.js",
            reloadOnOnline: true,
            disable:false,
            additionalPrecacheEntries: [{ url: '/~offline', revision }],
        });
        return withSerwist(nextConfig);
    }

    return nextConfig;
};
