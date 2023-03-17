require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.18',
    defaultNetwork: "sepolia",
    networks: {
      hardhat: {},
      sepolia: {
        url: process.env.SEPOLIA_URL,
        accounts: [process.env.SEPOLIA_ACCOUNT1, process.env.SEPOLIA_ACCOUNT2]
      },
      localhost: {
        url: "http://127.0.0.1:8545"
      }
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
