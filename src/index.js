import React from "react";
import { createRoot } from "react-dom/client";
import { app } from "./firebase";
import App from "./App";
import "./index.css";

console.log("[FRONTEND] Starting application initialization...");

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
