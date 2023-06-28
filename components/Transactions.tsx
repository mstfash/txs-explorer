'use client';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { CHAINS } from '@/lib/constants';
import { Transaction } from '@/lib/types';
import { useMemo, useState } from 'react';
import { formatNumber, getExternalLink, truncateAddress } from '@/lib/utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ethers } from 'ethers';
import { ChevronUp, ChevronDown } from 'lucide-react';

dayjs.extend(relativeTime);

const Transactions = ({
  txs,
  address,
}: {
  txs:
    | {
        chain: CHAINS;
        txs: any;
        balance: string;
      }[]
    | null
    | undefined;
  address: string;
}) => {
  const [chain, setChain] = useState(CHAINS.ETHEREUM);
  const [sortFilter, setSortFilter] = useState<'desc' | 'asc'>('desc');
  const [sortBy, setSortBy] = useState<'amount' | 'timeStamp'>('timeStamp');

  const handleChange = (value: string) => {
    setChain(value as CHAINS);
  };

  const sortTxs = (txs: Transaction[]) => {
    if (sortBy === 'amount') {
      return txs.sort((a, b) => {
        if (sortFilter === 'desc') {
          return Number(b.value) - Number(a.value);
        } else {
          return Number(a.value) - Number(b.value);
        }
      });
    } else {
      return txs.sort((a, b) => {
        if (sortFilter === 'desc') {
          return Number(b.timeStamp) - Number(a.timeStamp);
        } else {
          return Number(a.timeStamp) - Number(b.timeStamp);
        }
      });
    }
  };

  const handleSorting = (type: 'amount' | 'timeStamp') => {
    setSortBy(type);
    setSortFilter(sortFilter === 'desc' ? 'asc' : 'desc');
  };

  const currency = useMemo(() => {
    return chain === CHAINS.ETHEREUM ? 'ETH' : 'MATIC';
  }, [chain]);

  return (
    <div>
      <div className="m-3 flex align-center justify-between">
        <Select onValueChange={handleChange} value={chain}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Chain" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={CHAINS.ETHEREUM}>{CHAINS.ETHEREUM}</SelectItem>
              <SelectItem value={CHAINS.POLYGON}>{CHAINS.POLYGON}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="border rounded-lg p-2 text-sm">
          <span>Current Balance:</span>{' '}
          <span className="font-bold">
            {' '}
            {formatNumber(
              txs?.find((txRe) => txRe.chain === chain)?.balance as string
            )}{' '}
            {currency}
          </span>
        </div>
      </div>
      {txs?.find((txRe) => txRe.chain === chain)?.txs?.result?.length ? (
        <Table className="mt-5">
          <TableCaption>A list of address transactions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Tx Hash</TableHead>
              <TableHead>Block</TableHead>
              <TableHead>
                <button
                  className="flex items-center"
                  onClick={() => handleSorting('timeStamp')}
                >
                  Timestamp{' '}
                  <span>
                    {sortBy === 'timeStamp' ? (
                      sortFilter === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )
                    ) : null}
                  </span>
                </button>
              </TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>
                <button
                  className="flex items-center"
                  onClick={() => handleSorting('amount')}
                >
                  Amount{' '}
                  <span>
                    {sortBy === 'amount' ? (
                      sortFilter === 'desc' ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )
                    ) : null}
                  </span>
                </button>
              </TableHead>
              <TableHead className="text-right">Txn Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortTxs(
              txs?.find((txRe) => txRe.chain === chain)?.txs?.result
            )?.map((tx: Transaction) => {
              const fees = Number(tx.gasUsed) * Number(tx.gasPrice);
              const txnFee = ethers.formatEther(String(fees));
              return (
                <TableRow key={tx.hash}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/${address}/${tx.hash}`}
                      className="text-blue-500"
                    >
                      {truncateAddress(tx.hash)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <a
                      className="text-green-500"
                      href={getExternalLink(chain, tx.blockNumber, 'block')}
                      target="_blank"
                    >
                      {tx.blockNumber}
                    </a>
                  </TableCell>
                  <TableCell>
                    {tx.timeStamp
                      ? dayjs.unix(Number(tx.timeStamp)).fromNow()
                      : ''}
                  </TableCell>
                  <TableCell>
                    <a
                      className={
                        address.toLowerCase() === tx.from?.toLowerCase()
                          ? 'text-red-500'
                          : 'text-blue-500'
                      }
                      href={getExternalLink(chain, tx.from ?? '', 'address')}
                      target="_blank"
                    >
                      {truncateAddress(tx.from ?? '')}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a
                      className={
                        address.toLowerCase() === tx.to?.toLowerCase()
                          ? 'text-green-500'
                          : 'text-blue-500'
                      }
                      href={getExternalLink(chain, tx.to ?? '', 'address')}
                      target="_blank"
                    >
                      {truncateAddress(tx.to ?? '')}
                    </a>
                  </TableCell>
                  <TableCell>
                    {tx.value ? (
                      <>
                        {ethers.formatEther(tx.value)} {currency}
                      </>
                    ) : (
                      ''
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(txnFee, 8)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="mt-20">No transactions found.</div>
      )}
    </div>
  );
};

export default Transactions;
