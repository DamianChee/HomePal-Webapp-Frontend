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
let auth = null;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth();
  console.log("[Firebase.js] Firebase client SDK initialized");
} catch (error) {
  console.error("[Firebase.js] Firebase initialization failed:", error);
}

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
  subscribeToEvents,
  createMockEvent,
};