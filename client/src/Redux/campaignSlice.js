import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  currentlyDisplayedCampaign: null,
  myCampaigns: [],

  isFetching: false,
  isAddingCampaign: false,
  isDonating: false

};

export const fetchCampaigns = createAsyncThunk(
    "fetchCampaigns",
    async (contract, {dispatch}) => {
      dispatch(toggleIsFetching())

      const numberOfCampaigns = await contract.numberOfCampaigns();
      const campaignsData = [];
      for (let i = 0; i < numberOfCampaigns; i++) {
        let campaign = await contract.campaigns(i);
        campaignsData.push(campaign);
      }
      if (campaignsData.length > 0) {
        dispatch(setCampaigns(campaignsData))
      }
      
      dispatch(toggleIsFetching())
    }
)

export const fetchMyCampaigns = createAsyncThunk(
  "fetchMyCampaigns",
  async ({contract, account}, {dispatch}) => {
    dispatch(toggleIsFetching())

    const numberOfCampaigns = await contract.numberOfCampaigns();
    const myCampaignsData = [];
    for (let i = 0; i < numberOfCampaigns; i++) {
      let campaign = await contract.campaigns(i);
      if (campaign.owner === account) {
        myCampaignsData.push(campaign);
      }
    }
    if (myCampaignsData.length > 0) {
      dispatch(setMyCampaigns(myCampaignsData))
    }
    dispatch(toggleIsFetching())
  }
)

export const fetchCampaignById = createAsyncThunk(
    "fetchCampaignById",
    async ({contract,campaignId}, {dispatch}) => {
      dispatch(toggleIsFetching())
      const campaign = await contract.campaigns(campaignId);
      if (campaign) {
        dispatch(setCurrentlyDisplayedCampaign(campaign))
      }
      dispatch(toggleIsFetching())
    }
)

export const donateToCampaign = createAsyncThunk(
    "donateToCampaign",
    async ({contract, campaignId, amount}, {dispatch}) => {
      dispatch(toggleIsDonating())
      try {
        const tx = await contract.donateToCampaign(campaignId, {value: amount});
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          dispatch(fetchCampaignById({contract, campaignId}))
        }
      } catch (error) {
        console.error(error)
      } finally{
        dispatch(toggleIsDonating())
      }
    }
)


export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaigns: (state,action) => {
      state.campaigns = action.payload;
    },
    setCurrentlyDisplayedCampaign: (state, action) => {
        state.currentlyDisplayedCampaign = action.payload;
    },
    setMyCampaigns: (state, action) => {
        state.myCampaigns = action.payload;
    },
    toggleIsFetching: (state) => {
        state.isFetching = !state.isFetching
    },
    toggleIsDonating: (state) => {
        state.isDonating = !state.isDonating
    },
    toggleIsAddingCampaign: (state) => {
        state.isAddingCampaign = !state.isAddingCampaign
    }
  },
});

export const {setCampaigns, setCurrentlyDisplayedCampaign, setMyCampaigns, toggleIsFetching, toggleIsDonating, toggleIsAddingCampaign } = campaignSlice.actions;

export default campaignSlice.reducer