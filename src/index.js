import React from "react";
import { createRoot } from "react-dom/client";
import { auth } from "./firebase";
import App from "./App";
import "./index.css";

console.log("[FRONTEND] Starting application initialization...");

// Verify Firebase client SDK
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("[FRONTEND] User logged in:", user.email);
  } else {
    console.log("[FRONTEND] No user logged in");
  }
});

// Check backend status
async function checkBackendStatus() {
  try {
    const response = await fetch(
      "https://homepal-test-backend.vercel.app/api/status",
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
    return data;
  } catch (error) {
    console.error(
      "[index.js error caught] Failed to check backend status: ",
      error.message
    );
    return `[index.js] Failed to check backend status: ${error.message}`;
  }
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App checkBackendStatus={checkBackendStatus()} />
  </React.StrictMode>
);
