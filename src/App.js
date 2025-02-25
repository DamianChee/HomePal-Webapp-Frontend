import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import formatDate from "./utils/dateFormatter";

function App({ checkBackendStatus }) {
  const [message, setMessage] = useState({
    status: "There is no message yet.",
    timestamp: formatDate(),
  });

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
      console.log("[App.js Response ok] Devices:", data);
      return data;
    } catch (error) {
      console.error(
        "[App.js error caught] Failed to check backend status: ",
        error.message
      );
      return `[App.js] Failed to check backend status: ${error.message}`;
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await checkBackendStatus;

        setMessage(result);
      } catch (error) {
        console.error(
          "[App.js] Failed to check backend status: ",
          error.message
        );
      }
    }

    fetchData();
  }, [checkBackendStatus]);

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
        <button onClick={handleFetchDevices}>Fetch Devices!</button>
      </header>
    </div>
  );
}

export default App;
