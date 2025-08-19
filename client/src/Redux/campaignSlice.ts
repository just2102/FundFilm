import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";

import { Campaign } from "../types/campaignsTypes";

interface CampaignState {
  campaigns: Campaign[];
  currentlyDisplayedCampaign: Campaign | null;
  myCampaigns: Campaign[];

  isFetching: boolean;
  isStartingCampaign: boolean;
  isDonating: boolean;
  isWithdrawing: boolean;
  isTransacting: boolean;
}

const initialState: CampaignState = {
  campaigns: [],
  currentlyDisplayedCampaign: null,
  myCampaigns: [],

  isFetching: false,
  isStartingCampaign: false,
  isDonating: false,
  isWithdrawing: false,
  isTransacting: false,
};

interface FetchCampaignsArgs {
  contract: ethers.Contract;
}
export const fetchCampaigns = createAsyncThunk("fetchCampaigns", async ({ contract }: FetchCampaignsArgs, { dispatch }) => {
  dispatch(toggleIsFetching());
  try {
    const numberOfCampaigns = await contract.numberOfCampaigns();
    const campaignsData = [];
    for (let i = 0; i < numberOfCampaigns; i++) {
      const campaign = await contract.campaigns(i);
      campaignsData.push(campaign);
    }
    if (campaignsData.length > 0) {
      dispatch(setCampaigns(campaignsData));
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(toggleIsFetching());
  }
});

export const refetchCampaigns = createAsyncThunk("refetchCampaigns", async ({ contract }: FetchCampaignsArgs, { dispatch }) => {
  try {
    const numberOfCampaigns = await contract.numberOfCampaigns();
    const campaignsData = [];
    for (let i = 0; i < numberOfCampaigns; i++) {
      const campaign = await contract.campaigns(i);
      campaignsData.push(campaign);
    }
    if (campaignsData.length > 0) {
      dispatch(setCampaigns(campaignsData));
    }
  } catch (error) {
    console.error(error);
  }
});

interface FetchMyCampaignsArgs {
  contract: ethers.Contract;
  account: string;
}
export const fetchMyCampaigns = createAsyncThunk("fetchMyCampaigns", async ({ contract, account }: FetchMyCampaignsArgs, { dispatch }) => {
  dispatch(toggleIsFetching());
  try {
    const numberOfCampaigns = await contract.numberOfCampaigns();
    const myCampaignsData = [];
    for (let i = 0; i < numberOfCampaigns; i++) {
      const campaign = await contract.campaigns(i);
      if (campaign.owner === account) {
        myCampaignsData.push(campaign);
      }
    }
    if (myCampaignsData.length > 0) {
      dispatch(setMyCampaigns(myCampaignsData));
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(toggleIsFetching());
  }
});

interface FetchCampaignByIdArgs {
  contract: ethers.Contract;
  campaignId: number | string;
}
export const fetchCampaignById = createAsyncThunk(
  "fetchCampaignById",
  async ({ contract, campaignId }: FetchCampaignByIdArgs, { dispatch }) => {
    dispatch(toggleIsFetching());
    try {
      const campaignIdAsNumber = Number(campaignId);
      const campaign = await contract.campaigns(campaignIdAsNumber);
      if (campaign) {
        dispatch(setCurrentlyDisplayedCampaign(campaign));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(toggleIsFetching());
    }
  },
);

interface DonateToCampaignArgs {
  contract: ethers.Contract;
  campaignId: number | string;
  amount: ethers.BigNumber;
}
export const donateToCampaign = createAsyncThunk(
  "donateToCampaign",
  async ({ contract, campaignId, amount }: DonateToCampaignArgs, { dispatch }) => {
    dispatch(toggleIsDonating());
    try {
      const campaignIdAsNumber = Number(campaignId);
      const tx = await contract.donateToCampaign(campaignIdAsNumber, {
        value: amount,
      });
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        dispatch(fetchCampaignById({ contract, campaignId }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(toggleIsDonating());
    }
  },
);

interface WithdrawFromCampaignArgs {
  contract: ethers.Contract;
  campaignId: number;
}
export const withdrawFromCampaign = createAsyncThunk(
  "withdrawFromCampaign",
  async ({ contract, campaignId }: WithdrawFromCampaignArgs, { dispatch }) => {
    dispatch(toggleIsWithdrawing());
    try {
      const tx = await contract.withdrawFromCampaign(campaignId);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        dispatch(fetchCampaignById({ contract, campaignId }));
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(toggleIsWithdrawing());
    }
  },
);

interface StartCampaignArgs {
  contract: ethers.Contract;
  campaignToAdd: CampaignToAdd;
}
export type CampaignToAdd = {
  title: string;
  description: string;
  target: ethers.BigNumber;
  deadline: number;
  image: string;
  video: string;
};
export const startCampaign = createAsyncThunk("startCampaign", async ({ contract, campaignToAdd }: StartCampaignArgs, { dispatch }) => {
  dispatch(toggleIsStartingCampaign());
  const { title, description, target, deadline, image, video } = campaignToAdd;
  try {
    const tx = await contract.startCampaign(title, description, target, deadline, image, video);
    const receipt = await tx.wait();
    if (receipt.status === 1) {
      dispatch(fetchCampaigns({ contract }));
    }
  } catch (error) {
    return error;
  } finally {
    dispatch(toggleIsStartingCampaign());
  }
});

interface ExtendDeadlineArgs {
  contract: ethers.Contract;
  campaignId: number | string;
  newDeadline: number;
  costToExtend: ethers.BigNumber;
}
export const extendDeadline = createAsyncThunk(
  "extendDeadline",
  async ({ contract, campaignId, newDeadline, costToExtend }: ExtendDeadlineArgs, { dispatch }) => {
    dispatch(toggleIsTransacting());
    try {
      const campaignIdAsNumber = Number(campaignId);
      const tx = await contract.extendDeadline(campaignIdAsNumber, newDeadline, {
        value: costToExtend,
      });
      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        dispatch(fetchCampaignById({ contract, campaignId }));
      }
    } catch (error) {
      return error;
    } finally {
      dispatch(toggleIsTransacting());
    }
  },
);

interface EditCampaignArgs {
  contract: ethers.Contract;
  campaignId: number | string;
  newCampaignData: CampaignData;
}

export interface CampaignData {
  title: string;
  description: string;
  targetParsed: ethers.BigNumber;
  image: string;
  video: string;
}
export const editCampaign = createAsyncThunk(
  "editCampaign",
  async ({ contract, campaignId, newCampaignData }: EditCampaignArgs, { dispatch }) => {
    dispatch(toggleIsTransacting());
    const { title, description, targetParsed, image, video } = newCampaignData;
    try {
      const campaignIdAsNumber = Number(campaignId);

      const tx = await contract.editCampaign(campaignIdAsNumber, title, description, targetParsed, image, video);

      const receipt = await tx.wait();
      console.log(receipt);
      if (receipt.status === 1) {
        dispatch(fetchCampaignById({ contract, campaignId: campaignIdAsNumber }));
      }
    } catch (error) {
      throw error;
    } finally {
      dispatch(toggleIsTransacting());
    }
  },
);

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setCurrentlyDisplayedCampaign: (state, action) => {
      state.currentlyDisplayedCampaign = action.payload;
    },
    setMyCampaigns: (state, action) => {
      state.myCampaigns = action.payload;
    },
    toggleIsFetching: (state) => {
      state.isFetching = !state.isFetching;
    },
    toggleIsDonating: (state) => {
      state.isDonating = !state.isDonating;
    },
    toggleIsStartingCampaign: (state) => {
      state.isStartingCampaign = !state.isStartingCampaign;
    },
    toggleIsWithdrawing: (state) => {
      state.isWithdrawing = !state.isWithdrawing;
    },
    toggleIsTransacting: (state) => {
      state.isTransacting = !state.isTransacting;
    },
  },
});

export const {
  setCampaigns,
  setCurrentlyDisplayedCampaign,
  setMyCampaigns,
  toggleIsFetching,
  toggleIsDonating,
  toggleIsStartingCampaign,
  toggleIsWithdrawing,
  toggleIsTransacting,
} = campaignSlice.actions;

export default campaignSlice.reducer;
