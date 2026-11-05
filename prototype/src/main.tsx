import React from "react";
import { createRoot } from "react-dom/client";
import "./ds/bundle.css";
import "./index.css";
// Static imports keep the load order in every build, including the single-file share build:
// React on the window → design system bundle → app.
import "./ds/load";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
