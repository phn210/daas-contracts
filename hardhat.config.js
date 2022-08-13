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
    // forking: {
    //   url: "https://speedy-nodes-nyc.moralis.io/884c451ac01af3a0539e7e3c/bsc/mainnet/archive"
    // },
    chainId: 31337
  },
  testnetbsc: {
    url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    // "https://nd-006-375-626.p2pify.com/7d7fc1a2b5dd8f7a51697c940dd6fe33",
    // "https://data-seed-prebsc-1-s3.binance.org:8545/"
    chainId: 97,
    accounts: process.env.KEYS?.split(" "),
    explorer: "https://testnet.bscscan.com/"
  },
  // kovan:{
  //   chainId: 42,
  //   url: [
  //     "https://speedy-nodes-nyc.moralis.io/884c451ac01af3a0539e7e3c/eth/kovan",
  //     "https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
  //   ],
  //   explorer: "https://kovan.etherscan.io/"
  // },
  rinkeby: {
    networkCheckTimeout: 10000, 
    chainId: 4,
    accounts: process.env.KEYS?.split(" "),
    url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    // "https://ethereum-rinkeby-rpc.allthatnode.com/"
    // "https://rinkeby-light.eth.linkpool.io"
    explorer: "https://rinkeby.etherscan.io/"
  }
  // mainnetbsc: {
  //   url: "https://bsc-dataseed.binance.org/",
  //   chainId: 56,
  //   accounts: [process.env.KEY_1],
  //   explorer: "https://bscscan.com/"
  // }
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
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21
  }
};
