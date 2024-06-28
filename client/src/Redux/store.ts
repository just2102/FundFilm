import { configureStore } from "@reduxjs/toolkit";

import campaignReducer from "./campaignSlice";
import web3Reducer from "./web3slice";

const store = configureStore({
  reducer: {
    web3: web3Reducer,
    campaigns: campaignReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
