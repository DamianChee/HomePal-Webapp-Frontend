import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import formatDate from "./utils/dateFormatter";
import MobileMonitorDashboard from "./components/MobileMonitorDashboard";

/**
 * App Component
 * 
 * Main application component that serves as the entry point.
 * In this updated version, we've integrated the CarePal Mobile Dashboard while
 * keeping the original app's functionality.
 * 
 * The App includes:
 * 1. A toggle to switch between original view and CarePal dashboard
 * 2. Maintains the original Firebase connectivity features
 * 3. Uses modern React practices (hooks, functional components)
 */
function App() {
  const [message, setMessage] = useState({
    status: "There is no message yet.",
    timestamp: formatDate(),
  });

  const [devices, setDevices] = useState([]);
  const [showCarePalDashboard, setShowCarePalDashboard] = useState(false);
  
  // Handle Fetch Devices onClick
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

  useEffect(() => {
    handleFetchStatus();
  }, []);

  // Toggle between the original app view and the CarePal dashboard
  const toggleView = () => {
    setShowCarePalDashboard(!showCarePalDashboard);
    console.log("View toggled to:", !showCarePalDashboard ? "CarePal Dashboard" : "Original View");
  };

  // If showCarePalDashboard is true, display the MobileMonitorDashboard component
  if (showCarePalDashboard) {
    return (
      <div className="App">
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={toggleView}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
          >
            Back to Original View
          </button>
        </div>
        <MobileMonitorDashboard />
      </div>
    );
  }

  // Otherwise, display the original app view
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
        
        {/* Button to switch to the CarePal Mobile Dashboard */}
        <button 
          onClick={toggleView}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Switch to CarePal Dashboard
        </button>
      </header>
    </div>
  );
}

export default App;