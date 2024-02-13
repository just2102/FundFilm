import { ethers } from "ethers";

export type Campaign = {
  amountCollected: ethers.BigNumber;
  campaignId: ethers.BigNumber;
  deadline: ethers.BigNumber;
  description: string;
  hasWithdrawn: boolean;
  image?: string;
  owner: string;
  target: ethers.BigNumber;
  title: string;
  video: string;
};
