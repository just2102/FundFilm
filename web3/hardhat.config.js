require('dotenv').config();
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.18',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_ACCOUNT1, process.env.SEPOLIA_ACCOUNT2]
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
