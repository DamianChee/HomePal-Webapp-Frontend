import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase with error handling
let app;
let db = null;
let messaging = null;
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth();
  console.log("[Firebase.js] Firebase client SDK initialized");
} catch (error) {
  console.error("[Firebase.js] Firebase initialization failed:", error);
}

// Check if notifications are supported in this browser
const checkNotificationSupport = () => {
  try {
    return (
      typeof window !== 'undefined' && 
      'Notification' in window
    );
  } catch (error) {
    console.warn('[Firebase] Notification API check failed:', error);
    return false;
  }
};

// Safely check notification permission without throwing errors
const getNotificationPermission = () => {
  try {
    if (!checkNotificationSupport()) return 'denied';
    return Notification.permission;
  } catch (error) {
    console.warn('[Firebase] Failed to get notification permission:', error);
    return 'denied';
  }
};

// Safely request notification permission
const safeRequestNotificationPermission = async () => {
  if (!checkNotificationSupport()) {
    console.log('[Firebase] Notifications not supported in this browser');
    return 'denied';
  }
  
  try {
    // Modern promise-based API
    return await Notification.requestPermission();
  } catch (error) {
    // Fallback for older browsers that use callback pattern
    console.warn('[Firebase] Error with promise-based permission request:', error);
    
    return new Promise((resolve) => {
      try {
        Notification.requestPermission((result) => {
          resolve(result);
        });
      } catch (fallbackError) {
        console.error('[Firebase] Notification permission completely failed:', fallbackError);
        resolve('denied');
      }
    });
  }
};

// Initialize FCM if supported by the browser
const initializeFCM = () => {
  try {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && app) {
      messaging = getMessaging(app);
      console.log("[Firebase.js] Firebase Cloud Messaging initialized");
      return true;
    }
  } catch (error) {
    console.error("[Firebase.js] Firebase Cloud Messaging initialization failed:", error);
  }
  return false;
};

// Request permission and get FCM token - without VAPID key
const requestNotificationPermission = async () => {
  console.log("[Firebase] Starting notification permission request...");
  
  try {
    // Initialize FCM if not already done
    if (!messaging && !initializeFCM()) {
      console.log("[Firebase] FCM not supported or failed to initialize");
      return null;
    }

    // Check if notification API is supported
    if (!checkNotificationSupport()) {
      console.log("[Firebase] Notification API not supported in this browser");
      return null;
    }

    // Request permission safely
    const permission = await safeRequestNotificationPermission();
    console.log("[Firebase] Notification permission result:", permission);

    if (permission !== "granted") {
      console.log("[Firebase] Notification permission not granted");
      return null;
    }

    try {
      // Get FCM token without VAPID key
      console.log("[Firebase] Requesting FCM token...");
      const currentToken = await getToken(messaging);
      
      if (currentToken) {
        console.log("[Firebase] FCM token received");
        return currentToken;
      } else {
        console.log("[Firebase] No FCM token available");
        return null;
      }
    } catch (tokenError) {
      console.error("[Firebase] Error getting FCM token:", tokenError);
      return null;
    }
  } catch (error) {
    console.error("[Firebase] Error in requestNotificationPermission:", error);
    return null;
  }
};

// Safely create and show a notification
const showNotification = (title, body, icon = "/logo192.png") => {
  try {
    if (!checkNotificationSupport()) {
      console.log("[Firebase] Cannot show notification - not supported");
      return false;
    }
    
    if (getNotificationPermission() !== "granted") {
      console.log("[Firebase] Cannot show notification - permission not granted");
      return false;
    }
    
    const notification = new Notification(title, { body, icon });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return true;
  } catch (error) {
    console.error("[Firebase] Error showing notification:", error);
    return false;
  }
};

// Listen for messages when app is in foreground
const setupMessageListener = () => {
  if (!messaging) {
    console.log("[Firebase] Message listener setup failed - messaging not initialized");
    return;
  }

  try {
    onMessage(messaging, (payload) => {
      console.log("[Firebase] Message received in foreground:", payload);

      // Display a notification even when in foreground
      if (payload.notification) {
        const { title, body } = payload.notification;
        showNotification(title, body);
      }
    });
    console.log("[Firebase] Message listener setup complete");
  } catch (error) {
    console.error("[Firebase] Error setting up message listener:", error);
  }
};

// Setup a listener for new events in Firestore with error handling
const subscribeToEvents = (onEventAdded) => {
  try {
    // Check if Firestore is available
    if (!db) {
      console.warn(
        "[Firebase] Firestore not initialized, skipping event subscription"
      );
      return () => {}; // Return empty unsubscribe function
    }

    const eventsRef = collection(db, "events");
    const recentEventsQuery = query(
      eventsRef,
      orderBy("time", "desc"),
      limit(20)
    );

    console.log("[Firebase] Setting up Firestore event subscription...");
    
    // Listen for real-time updates with error handling
    return onSnapshot(
      recentEventsQuery,
      // Success callback
      (snapshot) => {
        try {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const newEvent = {
                id: change.doc.id,
                ...change.doc.data(),
              };

              // Check if this is actually a new event (not just initial load)
              const eventTime =
                newEvent.time?.toDate?.() || new Date(newEvent.time);
              const currentTime = new Date();
              const timeDiffInSeconds = (currentTime - eventTime) / 1000;

              // Only trigger for events that are less than 60 seconds old
              if (timeDiffInSeconds < 60) {
                console.log("[Firebase] New event detected:", newEvent);
                onEventAdded(newEvent);
                
                // Also try to show a notification directly
                if (checkNotificationSupport() && getNotificationPermission() === "granted") {
                  try {
                    showNotification(
                      "New HomePal Event", 
                      `Event: ${newEvent.action || 'New event detected'}`
                    );
                  } catch (notifError) {
                    console.error("[Firebase] Error showing direct notification:", notifError);
                  }
                }
              }
            }
          });
        } catch (docError) {
          console.error("[Firebase] Error processing snapshot:", docError);
        }
      },
      // Error callback
      (error) => {
        console.error("[Firebase] Error in Firestore subscription:", error);
        // Log detailed error info for debugging
        if (error.code === "permission-denied") {
          console.warn(
            "[Firebase] Permission denied. Check your Firestore security rules."
          );
        }
      }
    );
  } catch (error) {
    console.error("[Firebase] Failed to subscribe to events:", error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Create a mock event for testing
const createMockEvent = async (eventType = "Bed-Exit") => {
  try {
    if (!db) {
      console.error(
        "[Firebase] Firestore not initialized, cannot create mock event"
      );
      return null;
    }

    const eventsRef = collection(db, "events");

    const newEvent = {
      action: eventType, // 'Bed-Exit', 'Bedside-Fall', 'Attempted-Bed-Exit', etc.
      time: serverTimestamp(),
      isHandled: false,
      patientId: "test-patient-123",
      deviceId: "test-device-456",
      description: `Mock ${eventType} event created for testing`,
    };

    const docRef = await addDoc(eventsRef, newEvent);
    console.log("[Firebase] Mock event created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("[Firebase] Error creating mock event:", error);
    return null;
  }
};

export {
  app,
  db,
  auth,
  messaging,
  checkNotificationSupport,
  requestNotificationPermission,
  setupMessageListener,
  subscribeToEvents,
  createMockEvent,
  showNotification,
};