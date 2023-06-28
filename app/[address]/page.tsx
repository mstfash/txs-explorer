import Transactions from '@/components/Transactions';
import { getTxHistory } from '@/lib/api';
import { isAddress } from '@ethersproject/address';
import { notFound } from 'next/navigation';

const page = async ({
  params: { address },
}: {
  params: { address: string };
}) => {
  if (!isAddress(address)) return notFound();
  const txsResponse = await getTxHistory(address);
  return (
    <div className="overflow-auto">
      <Transactions txs={txsResponse} address={address} />
    </div>
  );
};

export default page;
