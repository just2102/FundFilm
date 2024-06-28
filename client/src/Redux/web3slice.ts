import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { setCampaigns, setCurrentlyDisplayedCampaign, setMyCampaigns } from "./campaignSlice";

interface Web3State {
  account: string | null;
  signer: any | null;
  balance: string | null;
  network: string | null;
  provider: ethers.providers.Web3Provider | null;
  contract: ethers.Contract | null;
  transactions: any[];
  currency: string | null;
}

const initialState: Web3State = {
  account: null,
  signer: null,
  balance: null,
  network: null,
  provider: null,
  contract: null,
  transactions: [],

  currency: null,
};

export const disconnectRequest = createAsyncThunk("web3/disconnect", async (_, { dispatch }) => {
  dispatch(disconnectWallet());
  dispatch(setCampaigns([]));
  dispatch(setCurrentlyDisplayedCampaign(null));
  dispatch(setMyCampaigns([]));
});

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setSigner: (state, action) => {
      state.signer = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setNetwork: (state, action) => {
      state.network = action.payload;
    },
    setProvider: (state, action) => {
      state.provider = action.payload;
    },
    setContract: (state, action) => {
      state.contract = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    disconnectWallet: (state) => {
      state.account = initialState.account;
      state.balance = initialState.balance;
      state.contract = null;
      state.network = initialState.network;
      state.provider = initialState.provider;
      state.signer = initialState.signer;
      state.transactions = initialState.transactions;
      state.currency = initialState.currency;
    },
  },
});

export const { setAccount, setSigner, setBalance, setNetwork, setProvider, setContract, addTransaction, setCurrency, disconnectWallet } =
  web3Slice.actions;

export default web3Slice.reducer;
