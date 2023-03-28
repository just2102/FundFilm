import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  account: null,
  signer: null,
  balance: null,
  network: null,
  provider: null,
  contract: null,
  transactions: [],
};

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
    disconnect: (state) => {
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

export const { setAccount, setSigner, setBalance, setNetwork, setProvider, setContract, addTransaction, disconnect } = web3Slice.actions;

export default web3Slice.reducer