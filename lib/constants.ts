import { ethers } from 'ethers';

export enum CHAINS {
  ETHEREUM = 'Ethrerum',
  POLYGON = 'Polygon',
}

export const DEFAULT_ADDRESS = process.env.DEFAULT_ADDRESS;

export const ETHERSCAN_URL = 'https://api.etherscan.io';
export const POLYGON_URL = 'https://api.polygonscan.com';

export const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
export const ALCHEMY_POLYGON_URL = process.env.ALCHEMY_POLYGON_URL;

export const ethersProvider = new ethers.EtherscanProvider(
  'mainnet',
  ETHERSCAN_API_KEY
);

export const polygonProvider = new ethers.JsonRpcProvider(ALCHEMY_POLYGON_URL);
