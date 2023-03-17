import web3Reducer from "./web3slice";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    web3: web3Reducer,
  },
});