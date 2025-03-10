import { initializeApp } from "firebase/app";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
let messaging = null;

// // Initialize Firebase Cloud Messaging if browser supports it
// if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
//   try {
//     messaging = getMessaging(app);
//     console.log("[Firebase.js] Firebase Cloud Messaging initialized");
//   } catch (error) {
//     console.error("[Firebase.js] Firebase Cloud Messaging initialization failed:", error);
//   }
// }

console.log("[Firebase.js] Firebase client SDK initialized");

// Request permission and get FCM token - without VAPID key
const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null;

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Get FCM token without VAPID key
    // Note: This will only work on Chrome running on FCM v1 projects
    // For full cross-browser support, you'd need a VAPID key
    const currentToken = await getToken(messaging);

    if (currentToken) {
      console.log("FCM token:", currentToken);
      return currentToken;
    } else {
      console.log("No FCM token available");
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return null;
  }
};

// Listen for messages when app is in foreground
const setupMessageListener = () => {
  if (!messaging) return;

  onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);

    // Display a notification even when in foreground
    if (payload.notification) {
      const { title, body } = payload.notification;

      // Show notification using the Notification API if permission granted
      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/logo192.png",
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }
  });
};

// Setup a listener for new events in Firestore
const subscribeToEvents = (onEventAdded) => {
  const eventsRef = collection(db, "events");
  const recentEventsQuery = query(
    eventsRef,
    orderBy("time", "desc"),
    limit(20)
  );

  // Listen for real-time updates
  return onSnapshot(recentEventsQuery, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const newEvent = {
          id: change.doc.id,
          ...change.doc.data(),
        };

        // Check if this is actually a new event (not just initial load)
        const eventTime = newEvent.time?.toDate?.() || new Date(newEvent.time);
        const currentTime = new Date();
        const timeDiffInSeconds = (currentTime - eventTime) / 1000;

        // Only trigger for events that are less than 60 seconds old
        if (timeDiffInSeconds < 60) {
          console.log("New event detected:", newEvent);
          onEventAdded(newEvent);
        }
      }
    });
  });
};

// Create a mock event for testing
const createMockEvent = async (eventType = "Bed-Exit") => {
  try {
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
    console.log("Mock event created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating mock event:", error);
    return null;
  }
};

export {
  app,
  db,
  messaging,
  requestNotificationPermission,
  setupMessageListener,
  subscribeToEvents,
  createMockEvent,
};
