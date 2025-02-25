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

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
