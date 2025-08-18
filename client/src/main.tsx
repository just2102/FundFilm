import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import store from "src/Redux/store";
import { WagmiProvider } from "wagmi";

import "src/styles/globals.css";
import App from "./App";
import { config } from "./config";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </WagmiProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
