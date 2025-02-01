import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, CacheFirst, ExpirationPlugin, CacheableResponsePlugin, RangeRequestsPlugin, SerwistGlobalConfig } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  // skipWaiting: true,
  // clientsClaim: true,
  disableDevLogs: true,
  precacheOptions: {
      cleanupOutdatedCaches: true,
      ignoreURLParametersMatching: [/.*/],
  },
  navigationPreload: false,
  runtimeCaching: [
    {
      matcher({ request }) {
        return request.destination === "video";
      },
      handler: new CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 16,
            maxAgeSeconds: 30 * 24 * 60 * 60, // ~30 days
            maxAgeFrom: "last-used",
          }),
          new CacheableResponsePlugin({
            statuses: [200],
          }),
          new RangeRequestsPlugin(),
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: '/offline', // the page that'll display if user goes offline
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

// const urlsToCache = ["/", "/user","/user/gallery", "/user/tree","/user/tree/", "/~offline"] as const

// self.addEventListener("install", (event) => {
//     event.waitUntil(
//         Promise.all(
//             urlsToCache.map((entry) => {
//                 const request = serwist.handleRequest({
//                     request: new Request(entry),
//                     event,
//                 })
//                 return request
//             }),
//         ),
//     )
// })
serwist.addEventListeners();