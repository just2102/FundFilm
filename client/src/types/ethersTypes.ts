import { ethers } from "ethers";

export type ContractInteraction = {
  meta: ContractInteractionMeta;
  payload: undefined | any;
  type: string; // "startCampaign/fulfilled"
  error?: ContractInteractionError;
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

type ContractInteractionError = {
  code: number;
  data: object;
  message: string;
};
