import React from "react";
import ReactDOM from "react-dom/client";
import App from "./presentation/App.jsx";
import "./presentation/index.css";
import "./application/selfTests.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
