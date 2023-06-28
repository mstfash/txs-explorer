import { ethers } from 'ethers';
import {
  CHAINS,
  ETHERSCAN_API_KEY,
  ETHERSCAN_URL,
  POLYGONSCAN_API_KEY,
  POLYGON_URL,
  ethersProvider,
  polygonProvider,
} from './constants';

const explorers = [
  {
    chain: CHAINS.ETHEREUM,
    url: ETHERSCAN_URL,
    apiKey: ETHERSCAN_API_KEY,
  },
  {
    chain: CHAINS.POLYGON,
    url: POLYGON_URL,
    apiKey: POLYGONSCAN_API_KEY,
  },
];

export async function getTxHistory(
  address: string,
  page: number = 1,
  offset: number = 100
) {
  if (!address) return null;
  try {
    return Promise.all(
      explorers.map(async (exp) => {
        const provider =
          exp.chain === CHAINS.ETHEREUM ? ethersProvider : polygonProvider;
        const fetchUrl = `${exp.url}/api?module=account&action=txlist&address=${address}&page=${page}&offset=${offset}&sort=desc&apikey=${exp.apiKey}`;
        return {
          chain: exp.chain,
          txs: await (await fetch(fetchUrl)).json(),
          balance: ethers.formatEther(
            (await provider.getBalance(address)).toString()
          ),
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getTxByTxnHash(txHash: string) {
  if (!txHash) return null;
  try {
    return Promise.all(
      explorers.map(async (exp) => {
        const fetchUrl = `${exp.url}/api?module=transaction&action=getstatus&txhash=${txHash} &apikey=${exp.apiKey}`;
        const provider =
          exp.chain === CHAINS.ETHEREUM ? ethersProvider : polygonProvider;
        return {
          chain: exp.chain,
          txStatus: await (await fetch(fetchUrl)).json(),
          txData: await provider.getTransaction(txHash),
        };
      })
    );
  } catch (error) {
    console.log(error);
  }
}
