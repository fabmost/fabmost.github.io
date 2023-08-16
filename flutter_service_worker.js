'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "b9309712b0d0f68d3b3519f345d1ea6f",
"index.html": "04de9e9ba022068e7a7f66ab2078d731",
"/": "04de9e9ba022068e7a7f66ab2078d731",
"main.dart.js": "4a3ddc6660f2cd35d3d5f9d4dd5d0361",
"flutter.js": "f85e6fb278b0fd20c349186fb46ae36d",
"favicon.png": "0e5b008fcb5793af5ca42bf7c10d6826",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "328d1e018f89a2008d27bc46ef671654",
"assets/AssetManifest.json": "16d3dd0407332feca98aaf47de5571cc",
"assets/NOTICES": "ffafac769f3de63f10c020871a189005",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/shaders/ink_sparkle.frag": "33d01f6463131a9d54a7539516bf0b9a",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/logo_black.png": "17df6e86aa2b8938ec7fec3974562735",
"assets/assets/images/mail.png": "b843e9584c01060ebb04c7a390e4e509",
"assets/assets/images/us.png": "8c836f5bb08e45b88de7bf4071bf5d41",
"assets/assets/images/map.png": "90f7807829329966cbef1308b2233c56",
"assets/assets/images/logo_name.png": "546775fc4458c25cf230be3e7fffd41e",
"assets/assets/images/background.png": "421ce8852d730c1ef1a76ff526899749",
"assets/assets/images/marca4.png": "559f3a5cc5c4328233adaa37166fef54",
"assets/assets/images/marca5.png": "260bf8c2791acbf632b9ed3e2f718219",
"assets/assets/images/marca6.png": "cf5ef52e1c760f26e8299ea34a38feca",
"assets/assets/images/marca2.png": "8fe0f473c5003d8021d2af9ffe8b6fbc",
"assets/assets/images/us_background_movil.png": "d9933ebf7ef7d61d95313865429de2b0",
"assets/assets/images/logo_white.png": "4d9dfbb3cdc8ecf03a189236ff845588",
"assets/assets/images/marca3.png": "013db2b857e223ab0ce93349bd8b3cd8",
"assets/assets/images/marca1.png": "d827dbae6e3d4325cf37927aa1d201ea",
"assets/assets/images/phone.png": "31745ebcfe69b6deea6605b125a2ef06",
"assets/assets/images/us_background.png": "49230198caa0b9a36aeb6ba75273a3e8",
"assets/assets/images/clients_background.png": "e478284e3924f093613b0a6d476b7e66",
"assets/assets/images/services_4.png": "e89b312be276c17168854c79a466048e",
"assets/assets/images/services_1.png": "3a465546d7fa249115046fd3c4606cf6",
"assets/assets/images/offer1.png": "63900e0bee71a27287c1d79e9cf8045f",
"assets/assets/images/offer3.png": "3db1fe9538e5774a4a052d3036a55992",
"assets/assets/images/services_2.png": "491e93044e4bed0d77dbe2f5d0591ae2",
"assets/assets/images/button.png": "fa0224049effb788be15234ac3257acc",
"assets/assets/images/services_3.png": "a0f068b96d1549eabb4542f59f5559bc",
"assets/assets/images/offer2.png": "4be43fd1305233bcf42f5497d6283d4f",
"assets/assets/videos/video.mp4": "0823032201035d999db1c6da9ee029c2",
"assets/assets/videos/video_movil.mp4": "47be684f31c4d55e00469026f8a4e0a0",
"canvaskit/canvaskit.js": "2bc454a691c631b07a9307ac4ca47797",
"canvaskit/profiling/canvaskit.js": "38164e5a72bdad0faa4ce740c9b8e564",
"canvaskit/profiling/canvaskit.wasm": "95a45378b69e77af5ed2bc72b2209b94",
"canvaskit/canvaskit.wasm": "bf50631470eb967688cca13ee181af62"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
