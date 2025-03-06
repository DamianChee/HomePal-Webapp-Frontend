import React, { useState, useEffect } from "react";
import "./App.css";
import useFetch from "./hooks/useFetch";
import MobileMonitorDashboard from "./components/MobileMonitorDashboard";

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
 */
function App() {
  const fetchData = useFetch();

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
      // const res = await fetchData("/events", "GET");
      const res = await fetchData(`/events/deviceid/RP42A00004`, "GET");
      if (!res.ok) throw new Error(res.data);
      console.log(res.data.response);
    } catch (error) {
      console.error(`[handleGetAllEvents] Error has occured:`, error.message);
    }
  };

  // Load backend status on mount (for Firebase connectivity)
  useEffect(() => {
    handleGetAPIStatus();
    handleGetAllEvents();
  }, []);

  // Handle Fetch Devices onClick - keeping this function for compatibility
  // async function handleFetchDevices() {
  //   try {
  //     const response = await fetch(
  //       "https://homepal-webapp-backend.vercel.app/devices",
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       const text = await response.text();
  //       console.error(
  //         "[App.js Response not ok] Backend devices fetch failed: ",
  //         text
  //       );
  //       return "[App.js] Backend devices fetch failed:";
  //     }

  //     const data = await response.json();
  //     // Log to console instead of updating the UI directly
  //     console.log("[App.js Response ok] Devices:", data);
  //     setDevices(JSON.stringify(data));
  //   } catch (error) {
  //     console.error(
  //       "[App.js error caught] Failed to check backend status: ",
  //       error.message
  //     );
  //     return `[App.js] Failed to check backend status: ${error.message}`;
  //   }
  // }

  // Display MobileMonitorDashboard as the main view
  return (
    <div className="App">
      <MobileMonitorDashboard />
    </div>
  );
}

export default App;
