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

// Event callback collection - we'll use this for fallback notifications
let eventCallbacks = [];

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth();
  console.log("[Firebase.js] Firebase client SDK initialized");
} catch (error) {
  console.error("[Firebase.js] Firebase initialization failed:", error);
}

// Check if notifications are supported - SAFELY, no exceptions thrown
const checkNotificationSupport = () => {
  try {
    // First check if window exists (we're in a browser)
    if (typeof window === 'undefined') return false;
    
    // Then check if the Notification API exists
    return 'Notification' in window;
  } catch (error) {
    console.warn('[Firebase] Notification API check failed:', error);
    return false;
  }
};

// Register a callback function for fallback notifications
const registerEventCallback = (callback) => {
  if (typeof callback === 'function') {
    eventCallbacks.push(callback);
    return true;
  }
  return false;
};

// Unregister a callback
const unregisterEventCallback = (callback) => {
  eventCallbacks = eventCallbacks.filter(cb => cb !== callback);
};

// Safely check notification permission without throwing errors
const getNotificationPermission = () => {
  try {
    // First check if notifications are supported
    if (!checkNotificationSupport()) return 'denied';
    
    // Then try to access the permission property
    return Notification.permission;
  } catch (error) {
    console.warn('[Firebase] Failed to get notification permission:', error);
    return 'denied';
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

// Request permission - returns true if granted, false otherwise
// This function is guaranteed not to throw an exception
const requestNotificationPermission = async () => {
  console.log("[Firebase] Starting notification permission request...");
  
  try {
    // Skip if notifications are not supported
    if (!checkNotificationSupport()) {
      console.log("[Firebase] Notification API not supported in this browser");
      return false;
    }

    // Try to request permission
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.warn("[Firebase] Error requesting notification permission:", error);
      return false;
    }
  } catch (error) {
    console.error("[Firebase] Error in requestNotificationPermission:", error);
    return false;
  }
};

// Safely create and show a notification
// Uses both native notifications AND fallback in-app notifications
const showNotification = (title, body, icon = "/logo192.png") => {
  console.log("[Firebase] Showing notification:", title, body);
  
  // Try native notifications first
  let nativeNotificationShown = false;
  
  try {
    if (checkNotificationSupport() && getNotificationPermission() === "granted") {
      const notification = new Notification(title, { body, icon });
      
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
      
      nativeNotificationShown = true;
      console.log("[Firebase] Native notification shown");
    }
  } catch (error) {
    console.warn("[Firebase] Native notification failed:", error);
    nativeNotificationShown = false;
  }
  
  // Always trigger fallback in-app notifications via callbacks
  try {
    eventCallbacks.forEach(callback => {
      try {
        callback({ title, body, icon });
      } catch (cbError) {
        console.error("[Firebase] Error in notification callback:", cbError);
      }
    });
  } catch (error) {
    console.error("[Firebase] Error showing fallback notification:", error);
  }
  
  return nativeNotificationShown;
};

// Listen for messages when app is in foreground
const setupMessageListener = () => {
  try {
    // Skip if messaging is not available
    if (!messaging) {
      console.log("[Firebase] Message listener setup failed - messaging not initialized");
      return;
    }

    onMessage(messaging, (payload) => {
      console.log("[Firebase] Message received in foreground:", payload);

      // Display a notification when a message arrives
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
    // Skip if Firestore is not available
    if (!db) {
      console.warn(
        "[Firebase] Firestore not initialized, skipping event subscription"
      );
      return () => {}; // Return empty unsubscribe function
    }

    console.log("[Firebase] Setting up Firestore event subscription...");
    
    // Define the query
    const eventsRef = collection(db, "events");
    const recentEventsQuery = query(
      eventsRef,
      orderBy("time", "desc"),
      limit(20)
    );
    
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
                
                // Call the provided callback
                try {
                  onEventAdded(newEvent);
                } catch (cbError) {
                  console.error("[Firebase] Error in event callback:", cbError);
                }
                
                // Also show a notification
                try {
                  showNotification(
                    "New HomePal Event", 
                    `Event: ${newEvent.action || 'New event detected'}`
                  );
                } catch (notifError) {
                  console.error("[Firebase] Error showing notification:", notifError);
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
  registerEventCallback,
  unregisterEventCallback,
};