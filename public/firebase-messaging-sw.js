// Firebase Messaging Service Worker

// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
// Note: The actual config values will be passed from the main app
firebase.initializeApp({
  apiKey: self.FIREBASE_CONFIG?.apiKey || "placeholder-api-key",
  authDomain: self.FIREBASE_CONFIG?.authDomain || "placeholder-auth-domain",
  projectId: self.FIREBASE_CONFIG?.projectId || "placeholder-project-id",
  messagingSenderId: self.FIREBASE_CONFIG?.messagingSenderId || "placeholder-sender-id",
  appId: self.FIREBASE_CONFIG?.appId || "placeholder-app-id",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'HomePal Alert';
  const notificationOptions = {
    body: payload.notification?.body || 'New event detected',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'homepal-notification',
    data: payload.data
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window is already open, open a new one
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Handle messages sent from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    console.log('[firebase-messaging-sw.js] Received Firebase config from main app');
    self.FIREBASE_CONFIG = event.data.config;
  }
});