import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import './Loader.css'
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LoaderProvider } from "./InitialComponents/LoaderContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </React.StrictMode>
);

reportWebVitals();
