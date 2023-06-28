'use client';
import { CHAINS } from '@/lib/constants';
import { formatNumber, getExternalLink } from '@/lib/utils';
import { TransactionResponse, ethers } from 'ethers';
import { useMemo } from 'react';

const TransactionHash = ({
  txResp,
}: {
  txResp:
    | {
        chain: CHAINS;
        txStatus: any;
        txData: TransactionResponse | null;
      }[]
    | null
    | undefined;
}) => {
  const tx = txResp?.[0]?.txData ? txResp[0] : txResp?.[1];
  const returnStatus = (status: string | null) => {
    switch (status) {
      case '1':
        return `Failed ${
          tx?.txStatus?.result?.errDescription
            ? '- with error ' + tx?.txStatus?.result?.errDescription
            : ''
        }`;
      case '0':
        return 'Success';
      default:
        return 'Pending';
    }
  };
  const fees = Number(tx?.txData?.gasLimit) * Number(tx?.txData?.gasPrice);
  const txnFee = ethers.formatEther(String(fees));

  const currency = useMemo(() => {
    return tx?.chain === CHAINS.ETHEREUM ? 'ETH' : 'MATIC';
  }, [tx]);
  return (
    <div>
      <div className="flex lg:flex-row flex-col">
        <span className="lg:min-w-[200px]">Transaction Hash:</span>
        <span className="text-break">
          <a
            href={getExternalLink(
              tx?.chain as CHAINS,
              tx?.txData?.hash as string,
              'transaction'
            )}
            target="_blank"
            className="text-blue-500"
          >
            {tx?.txData?.hash}
          </a>
        </span>
      </div>

      <div className="flex lg:flex-row flex-col mt-5">
        <span className="lg:min-w-[200px]">Status:</span>
        <div
          className={`text-break rounded-md border border-slate p-2 ${
            tx?.txStatus?.result?.isError === '0'
              ? 'text-green-700'
              : tx?.txStatus?.result?.isError === '1'
              ? 'text-red-400'
              : ''
          }`}
        >
          {returnStatus(tx?.txStatus?.result?.isError)}
        </div>
      </div>

      <div className="flex lg:flex-row flex-col mt-5">
        <span className="lg:min-w-[200px]">Block:</span>
        <span className="text-break">
          <a
            href={getExternalLink(
              tx?.chain as CHAINS,
              tx?.txData?.blockNumber?.toString() as string,
              'block'
            )}
            target="_blank"
            className="text-blue-500"
          >
            {tx?.txData?.blockNumber}
          </a>
        </span>
      </div>
      <div className="flex lg:flex-row flex-col mt-5">
        <span className="lg:min-w-[200px]">From:</span>
        <span className="text-break">
          <a
            href={getExternalLink(
              tx?.chain as CHAINS,
              tx?.txData?.from as string,
              'address'
            )}
            target="_blank"
            className="text-blue-500"
          >
            {tx?.txData?.from}
          </a>
        </span>
      </div>
      <div className="flex lg:flex-row flex-col mt-5">
        <span className="lg:min-w-[200px]">To:</span>
        <span className="text-break">
          <a
            href={getExternalLink(
              tx?.chain as CHAINS,
              tx?.txData?.to as string,
              'address'
            )}
            target="_blank"
            className={'text-blue-500'}
          >
            {tx?.txData?.to}
          </a>
        </span>
      </div>
      <div className="flex lg:flex-row flex-col mt-5">
        <span className="lg:min-w-[200px]">Value:</span>
        <span className="text-break">
          {tx?.txData?.value ? (
            <>
              {ethers.formatEther(tx?.txData?.value)} {currency}{' '}
            </>
          ) : (
            ''
          )}
        </span>
      </div>
      <div className="flex lg:flex-row flex-col mt-5">
        <span className="lg:min-w-[200px]">Transaction Fee:</span>
        <span className="text-break">
          {formatNumber(txnFee, 8)} {currency}
        </span>
      </div>
      <div className="flex lg:flex-row flex-col mt-5">
        <span className="lg:min-w-[200px]">Gas Price:</span>
        <span className="text-break">
          {formatNumber(ethers.formatEther(tx?.txData?.gasPrice as bigint), 8)}{' '}
          {currency}
        </span>
      </div>
    </div>
  );
};

export default TransactionHash;
