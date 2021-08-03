// const FILES_TO_CACHE = [
//     "/",
//     "/index.html",
//     "/index.js",
//     "/manifest.webmanifest",
//     "/styles.css",
//     "/db.js",
//     "/icons/icon-144x144.png",
//     "/icons/icon-192x192.png",
//     "/icons/icon-512x512.png",
//   ];


// const CACHE_NAME = "static-cache-v2";
// const DATA_CACHE_NAME = "data-cache-v1";


// self.addEventListener("install", function (evt) {
//     evt.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       console.log("Your files were pre-cached successfully!");
//       return cache.addAll(FILES_TO_CACHE);
//     })
//   );
//   self.skipWaiting();
// });


// self.addEventListener("activate", function (evt) {
//   evt.waitUntil(
//      caches.keys().then((keyList) => {
//       return Promise.all(
//         keyList.map((key) => {
//           if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
//             console.log("Removing old cache data", key);
//             return caches.delete(key);
//           }
//         })
//       );
//     })
//   );
//   self.clients.claim();
// });


// self.addEventListener("fetch", function (evt) {

//   if (evt.request.url.includes("/api/")) {
//     evt.respondWith(
//       caches
//         .open(DATA_CACHE_NAME)
//         .then((cache) => {
//           return fetch(evt.request)
//             .then((response) => {

//               if (response.status === 200) {
//                 cache.put(evt.request.url, response.clone());
//               }
//               return response;
//             })
//             .catch((err) => {
//               return cache.match(evt.request);
//             });
//         })
//         .catch((err) => console.log(err))
//     );

//     return;
//   }

//     evt.respondWith(
//     caches.match(evt.request).then(function (response) {
//       return response || fetch(evt.request);
//     })
//   );
// });



const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/db.js",
    "/icons/icon-144x144.png",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

// install
self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// activate
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// fetch
self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        // if cache is available, respond with cache
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        // if there are no cache, try fetching request
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});
