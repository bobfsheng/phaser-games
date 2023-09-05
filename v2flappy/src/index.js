import React from "react";
import { createRoot } from "react-dom/client";
import ReactModal from "react-modal";
import App from "./App";

ReactModal.setAppElement('#app');
const container = document.getElementById("app");
const root = createRoot (container);
root.render(<App />);


