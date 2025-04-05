import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config({
  path: './.env.local'
})

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.28" },
      { version: "0.8.19" },
    ],
  },
  networks: {
    baseSepolia: {
      url: "https://sepolia.base.org", // Replace with the actual Base Sepolia RPC URL
      accounts: process.env.BASE_SEPOLIA_PRIVATE_KEY ? [process.env.BASE_SEPOLIA_PRIVATE_KEY] : [],
    },
  },
};

export default config;
