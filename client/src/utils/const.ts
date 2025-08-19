import { NativeCurrency } from "src/types/currencies";

export const networks: Record<string, string> = {
  Polygon: "0x3bC6720b8CbF472B7672b52b1F00E140511Ba4C1",
  Scroll: "0x60ce7a4a77a0034eb3629dc99a52b2a8cfc39c5f",
  Sepolia: "0xfAEF615930a30B512374d729949707BD5d355326",
};

export const networksToCurrencies: Record<string, NativeCurrency> = {
  [networks.Polygon]: "MATIC",
  [networks.Scroll]: "ETH",
  [networks.Sepolia]: "ETH",
};

export const CHAIN_IDS: Record<string, number> = {
  Polygon: 137,
  Scroll: 534352,
  Sepolia: 11155111,
};
