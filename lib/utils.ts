import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CHAINS } from './constants';
import numeral from 'numeral';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateAddress = (walletAddress: string) =>
  `${walletAddress.slice(0, 4 + 2)}...${walletAddress.slice(-4)}`;

export const getExternalLink = (
  chain: CHAINS,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string => {
  const prefix =
    CHAINS.ETHEREUM === chain
      ? 'https://etherscan.io'
      : 'https://polygonscan.com';

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`;
    }
    case 'token': {
      return `${prefix}/token/${data}`;
    }
    case 'block': {
      return `${prefix}/block/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`;
    }
  }
};

export const formatNumber = (value: string, digits = 4, round = false) => {
  const nOfDigits = Array.from(Array(digits), (_) => 0).join('');
  if (!value) {
    return '0';
  }
  const n = Number(value);
  if (n < 0) return value;
  if (Number.isInteger(n) || value.length < 5) {
    return n;
  }
  let val;
  if (round) {
    val = numeral(n).format(`0.${nOfDigits}`);
  } else {
    val = numeral(n).format(`0.${nOfDigits}`, Math.floor);
  }

  return isNaN(Number(val)) ? value : val;
};
