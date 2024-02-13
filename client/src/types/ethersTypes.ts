import { ethers } from "ethers";

export type ContractInteraction = {
  meta: ContractInteractionMeta;
  payload: undefined | any;
  type: string; // "startCampaign/fulfilled"
  error?: any;
  reason?: string;
};

type ContractInteractionMeta = {
  arg: {
    contract: ethers.Contract;
    // campaignToAdd
  };
  requestId: string;
  requestStatus: string;
};
