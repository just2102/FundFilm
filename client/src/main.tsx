import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import ReactDOM from "react-dom/client";
import store from "src/Redux/store";
import { WagmiProvider } from "wagmi";

import "src/styles/globals.css";
import App from "./App";
import { config } from "./config";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <WagmiProvider config={config}>
          <App />
        </WagmiProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
