import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
// import formatDate from "./utils/dateFormatter";
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
  // Load backend status on mount (for Firebase connectivity)
  useEffect(() => {
    handleFetchStatus();
  }, []);

  // Handle Fetch Devices onClick - keeping this function for compatibility
  async function handleFetchDevices() {
    try {
      const response = await fetch(
        "https://homepal-webapp-backend.vercel.app/devices",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "[App.js Response not ok] Backend devices fetch failed: ",
          text
        );
        return "[App.js] Backend devices fetch failed:";
      }

      const data = await response.json();
      // Log to console instead of updating the UI directly
      console.log("[App.js Response ok] Devices:", data);
      setDevices(JSON.stringify(data));
    } catch (error) {
      console.error(
        "[App.js error caught] Failed to check backend status: ",
        error.message
      );
      return `[App.js] Failed to check backend status: ${error.message}`;
    }
  }

  async function handleFetchStatus() {
    try {
      const response = await fetch(
        "https://homepal-webapp-backend.vercel.app/api/status",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error(
          "[index.js Response not ok] Backend status check failed: ",
          text
        );
        return "[index.js] Backend status check failed:";
      }

      const data = await response.json();
      console.log("[index.js Response ok] Backend status:", data);
      setMessage(data);
    } catch (error) {
      console.error(
        "[index.js error caught] Failed to check backend status: ",
        error.message
      );
      return `[index.js] Failed to check backend status: ${error.message}`;
    }
  }

  // Display MobileMonitorDashboard as the main view
  return (
    <div className="App">
      <MobileMonitorDashboard />
    </div>
  );

  /*
  // Original App View (commented out as requested)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>{`Status: ${message.status}`}</div>
        <div>{`timestamp: ${message.timestamp}`}</div>
        <button onClick={handleFetchStatus}>Is Firebase Connected?</button>
        <button onClick={handleFetchDevices}>Fetch Devices!</button>
        <div>{devices ? devices : ""}</div>
      </header>
    </div>
  );
  */
}

export default App;
