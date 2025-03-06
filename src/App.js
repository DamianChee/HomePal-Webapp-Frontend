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

  // Load backend status on mount (for Firebase connectivity)
  useEffect(() => {
    handleGetAPIStatus();
    // handleGetAllEvents();
    handleGetLatestEvents();
    handleGetRecentEvents();
  }, []);

  // Display MobileMonitorDashboard as the main view
  return (
    <div className="App">
      <MobileMonitorDashboard />
    </div>
  );
}

export default App;
