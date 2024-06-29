import { ethers } from "ethers";

export function fromReadableAmount(amount: string, decimals?: number) {
  if (!decimals) {
    return ethers.utils.parseUnits(amount);
  }

  return ethers.utils.parseUnits(amount, decimals);
}

export function fromBigNumber(value: ethers.BigNumber): number {
  return Number(value);
}
