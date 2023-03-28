import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  campaigns: [],
  currentlyDisplayedCampaign: null,
  myCampaigns: [],

  isFetching: false,
  isStartingCampaign: false,
  isDonating: false,
  isWithdrawing: false,
  isTransacting: false
};

export const fetchCampaigns = createAsyncThunk(
    "fetchCampaigns",
    async (contract, {dispatch}) => {
      dispatch(toggleIsFetching())
      try {
        const numberOfCampaigns = await contract.numberOfCampaigns();
        const campaignsData = [];
        for (let i = 0; i < numberOfCampaigns; i++) {
          let campaign = await contract.campaigns(i);
          campaignsData.push(campaign);
        }
        if (campaignsData.length > 0) {
          dispatch(setCampaigns(campaignsData))
        }
      }
      catch (error) {
        console.error(error);
      } finally {
        dispatch(toggleIsFetching())
      }
    }
)

export const fetchMyCampaigns = createAsyncThunk(
  "fetchMyCampaigns",
  async ({contract, account}, {dispatch}) => {
    dispatch(toggleIsFetching())
    try {
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
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(toggleIsFetching())
    }
  }
)

export const fetchCampaignById = createAsyncThunk(
    "fetchCampaignById",
    async ({contract,campaignId}, {dispatch}) => {
      dispatch(toggleIsFetching())
      try {
        const campaign = await contract.campaigns(campaignId);
        if (campaign) {
          dispatch(setCurrentlyDisplayedCampaign(campaign))
        }
      } catch (error) {
        console.error(error)
      } finally{
        dispatch(toggleIsFetching())
      }
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

export const withdrawFromCampaign = createAsyncThunk(
    "withdrawFromCampaign",
    async ({contract, campaignId}, {dispatch}) => {
      dispatch(toggleIsWithdrawing())
      try {
        const tx = await contract.withdrawFromCampaign(campaignId);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          dispatch(fetchCampaignById({contract, campaignId}))
        }
      } catch (error) {
        return error
      } finally{
        dispatch(toggleIsWithdrawing())
      }
    }
)

export const startCampaign = createAsyncThunk(
    "startCampaign",
    async ({contract, campaignToAdd}, {dispatch}) => {
      dispatch(toggleIsStartingCampaign())
      const {title, description, target, deadline, image, video} = campaignToAdd;
      try {
        const tx = await contract.startCampaign(title,description,target,deadline,image,video)
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          dispatch(fetchCampaigns(contract))
        }
      } catch (error) {
        return error
      } finally{
        dispatch(toggleIsStartingCampaign())
      }
    }
)

export const extendDeadline = createAsyncThunk(
    "extendDeadline",
    async ({contract, campaignId, newDeadline}, {dispatch}) => {
      dispatch(toggleIsTransacting())
      try {
        const tx = await contract.extendDeadline(campaignId, newDeadline);
        const receipt = await tx.wait();
        console.log(receipt)
        if (receipt.status === 1) {
          dispatch(fetchCampaignById({contract, campaignId}))
        }
      } catch (error) {
        return error
      } finally{
        dispatch(toggleIsTransacting())
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
    toggleIsStartingCampaign: (state) => {
        state.isStartingCampaign = !state.isStartingCampaign
    },
    toggleIsWithdrawing: (state) => {
      state.isWithdrawing = !state.isWithdrawing
    },
    toggleIsTransacting: (state) => {
      state.isTransacting = !state.isTransacting
    }
  },
});

export const {setCampaigns, 
  setCurrentlyDisplayedCampaign, 
  setMyCampaigns, toggleIsFetching, 
  toggleIsDonating, 
  toggleIsStartingCampaign,
  toggleIsWithdrawing,
  toggleIsTransacting } = campaignSlice.actions;

export default campaignSlice.reducer