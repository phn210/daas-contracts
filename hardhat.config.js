const { resolve } = require("path");
const { config } = require("dotenv");
require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("hardhat-gas-reporter");
require("hardhat-storage-layout");
require("hardhat-contract-sizer");

config({ path: resolve(__dirname, "./.env") });

var accounts;
if (process.env.MNEMONIC)
  accounts = {
    count: 10,
    mnemonic: process.env.MNEMONIC,
    path: "m/44'/60'/0'/0",
  };
else if (process.env.KEYS)
  accounts = process.env.KEYS.split(" ").map((key) => ({
    privateKey: key,
    balance: 1_000_000_000,
  }));
else throw new Error("Must provide mnemonic/keys (env)!");

const networks = {
  hardhat: {
    accounts: accounts,
    mining: {
      mempool: {
        order: "fifo",
      },
    },
    forking: {
      url: "https://speedy-nodes-nyc.moralis.io/884c451ac01af3a0539e7e3c/bsc/mainnet/archive"
    },
    chainId: 31337
  },
  testnetbsc: {
    url: "https://data-seed-prebsc-2-s2.binance.org:8545/",
    chainId: 97,
    gasPrice: 20000000000,
    gasMultiplier: 2,
    accounts: process.env.KEYS?.split(" "),
    explorer: "https://testnet.bscscan.com/"
  },
  mainnetbsc: {
    url: "https://bsc-dataseed.binance.org/",
    chainId: 56,
    accounts: [process.env.KEY_1],
    explorer: "https://bscscan.com/"
  }
};

module.exports = {
  defaultNetwork: "hardhat",
  networks: networks,
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          metadata: { bytecodeHash: "none" },
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.5.16",
        settings: { optimizer: { enabled: true, runs: 100 } },
      },
    ],
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  }
};
