import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setCampaigns, setCurrentlyDisplayedCampaign, setMyCampaigns } from "./campaignSlice";

const initialState = {
  account: null,
  signer: null,
  balance: null,
  network: null,
  provider: null,
  contract: null,
  transactions: [],

  currency: null
};

export const disconnectRequest = createAsyncThunk(
  "web3/disconnect",
  async (_,{dispatch}) => {
    dispatch(disconnectWallet())
    dispatch(setCampaigns([]))
    dispatch(setCurrentlyDisplayedCampaign(null))
    dispatch(setMyCampaigns([]))
  }
)

export const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    setSigner: (state,action) => {
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
    setCurrency: (state,action) => {
      state.currency = action.payload;
    },
    disconnectWallet: (state) => {
      state.account = initialState.account;
      state.balance = initialState.balance;
      state.contract = initialState.contract;
      state.network = initialState.network;
      state.provider = initialState.provider;
      state.signer = initialState.signer;
      state.transactions = initialState.transactions;
    }
  },
});

export const { setAccount, setSigner, setBalance, setNetwork, setProvider, setContract, addTransaction, setCurrency, disconnectWallet } = web3Slice.actions;

export default web3Slice.reducer