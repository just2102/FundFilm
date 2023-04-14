import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
// import { ThirdwebProvider } from "@thirdweb-dev/react";
import "./styles/globals.css";
import { BrowserRouter, HashRouter } from "react-router-dom";
import store from "./Redux/store";
import { Provider } from "react-redux";


const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    {/* <ThirdwebProvider activeChain={activeChain}> */}
      <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
      </HashRouter>
    {/* </ThirdwebProvider> */}
  </React.StrictMode>
);
