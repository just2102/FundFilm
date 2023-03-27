import web3Reducer from "./web3slice";
import campaignReducer from "./campaignSlice"
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    web3: web3Reducer,
    campaigns: campaignReducer
  },
});