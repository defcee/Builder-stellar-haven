// Service Worker for Bizzleap PWA
const CACHE_NAME = "bizzleap-v1";
const STATIC_CACHE_NAME = "bizzleap-static-v1";

// Files to cache immediately
const STATIC_FILES = [
  "/",
  "/index.html",
  "/auth.html",
  "/dashboard.html",
  "/profile.html",
  "/src/css/base.css",
  "/src/css/welcome.css",
  "/src/css/auth.css",
  "/src/css/dashboard.css",
  "/src/css/profile.css",
  "/src/js/welcome.js",
  "/src/js/auth.js",
  "/src/js/dashboard.js",
  "/src/js/profile.js",
  "/manifest.json",
  "/public/placeholder.svg",
];

// Files to cache on first access
const DYNAMIC_CACHE_FILES = [
  "/chat.html",
  "/social-campaigns.html",
  "/feedback.html",
];

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log("Static files cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Failed to cache static files:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            // Cache successful responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          })
          .catch(() => {
            // Fallback to cached index for SPA routing
            return caches.match("/index.html");
          });
      }),
    );
    return;
  }

  // Handle other requests (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Cache successful responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch((error) => {
          console.error("Fetch failed:", error);

          // Return fallback for specific file types
          if (request.destination === "image") {
            return caches.match("/public/placeholder.svg");
          }

          throw error;
        });
    }),
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle offline actions here
      console.log("Performing background sync..."),
    );
  }
});

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("Push notification received:", event);

  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/public/placeholder.svg",
      badge: "/public/placeholder.svg",
      tag: data.tag || "default",
      actions: [
        {
          action: "view",
          title: "View",
          icon: "/public/placeholder.svg",
        },
        {
          action: "dismiss",
          title: "Dismiss",
        },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Bizzleap", options),
    );
  }
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);

  event.notification.close();

  if (event.action === "view") {
    // Open the app
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handling for communication with main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker received message:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Error handling
self.addEventListener("error", (event) => {
  console.error("Service Worker error:", event.error);
});

self.addEventListener("unhandledrejection", (event) => {
  console.error("Service Worker unhandled rejection:", event.reason);
  event.preventDefault();
});
