import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles/globals.css";
import { BrowserRouter, HashRouter } from "react-router-dom";


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    {/* <ThirdwebProvider activeChain={activeChain}> */}
      <HashRouter>
        <App />
      </HashRouter>
    {/* </ThirdwebProvider> */}
  </React.StrictMode>
);
