require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("@matterlabs/hardhat-zksync-deploy");
require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 500000,
      },
    },
  },
  zksolc: {
    version: "1.3.5",
    compilerSource: "binary",
    settings: {},
  },
  networks: {
    sepolia: {
      zksync: false,
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_ACCOUNT1, process.env.SEPOLIA_ACCOUNT2],
    },
    localhost: {
      zksync: false,
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      zksync: false,
    },
    zkSyncTestnet: {
      url: "https://testnet.era.zksync.dev",
      ethNetwork: "goerli",
      zksync: true,
    },
    scroll: {
      url: "https://rpc.scroll.io",
      chainId: 534352,
    },
  },
};
