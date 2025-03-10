import React, { useState, useEffect } from "react";
import "./App.css";
import useFetch from "./hooks/useFetch";
import MobileMonitorDashboard from "./components/MobileMonitorDashboard";
import { 
  requestNotificationPermission, 
  setupMessageListener, 
  subscribeToEvents 
} from "./firebase";

/**
 * App Component
 *
 * Main application component that serves as the entry point.
 * Now using CarePal Mobile Dashboard as the default view.
 * The original app functionality is kept but commented out.
 *
 * The App includes:
 * 1. CarePal dashboard as the main view
 * 2. Firebase connectivity available in the background
 * 3. Uses modern React practices (hooks, functional components)
 * 4. Real-time event notifications from Firestore
 * 5. Push notifications via Firebase Cloud Messaging
 */
function App() {
  const fetchData = useFetch();
  const [newEvents, setNewEvents] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(false);

  const handleGetAPIStatus = async () => {
    try {
      const res = await fetchData("/api/status", "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
    } catch (error) {
      console.error(`[handleGetAPIStatus] Error has occured:`, error.message);
    }
  };

  const handleGetAllEvents = async () => {
    try {
      const res = await fetchData("/events", "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
    } catch (error) {
      console.error(`[handleGetAllEvents] Error has occured:`, error.message);
    }
  };

  const handleGetLatestEvents = async () => {
    try {
      // const res = await fetchData("/events", "GET");
      const res = await fetchData(`/events/latest`, "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
    } catch (error) {
      console.error(
        `[handleGetLatestEvents] Error has occured:`,
        error.message
      );
    }
  };

  const handleGetRecentEvents = async () => {
    try {
      // const res = await fetchData("/events", "GET");
      const res = await fetchData(`/events/recent`, "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
    } catch (error) {
      console.error(
        `[handleGetRecentEvents] Error has occured:`,
        error.message
      );
    }
  };

  // Handle new event received from Firestore
  const handleNewEvent = (event) => {
    setNewEvents(prevEvents => [event, ...prevEvents]);
    
    // Show browser notification if permission granted and app is visible
    if (Notification.permission === 'granted' && document.visibilityState === 'visible') {
      // Create and show a notification using the Web Notifications API
      const notification = new Notification('HomePal Alert', {
        body: `New event: ${event.action || 'Event detected'}`,
        icon: '/logo192.png'
      });
      
      // Focus the window when notification is clicked
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  // Setup notification permission and Firebase listeners
  useEffect(() => {
    // Setup notification permission
    const setupNotifications = async () => {
      const token = await requestNotificationPermission();
      setNotificationPermission(!!token);
      
      if (token) {
        // Setup foreground message listener
        setupMessageListener();
      }
    };
    
    setupNotifications();
    
    // Subscribe to real-time Firestore events
    const unsubscribe = subscribeToEvents(handleNewEvent);
    
    // Verify backend connectivity
    handleGetAPIStatus();
    
    // Cleanup on unmount
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Display MobileMonitorDashboard as the main view
  // Pass new events from real-time listeners
  return (
    <div className="App">
      <MobileMonitorDashboard newEvents={newEvents} />
    </div>
  );
}

export default App;