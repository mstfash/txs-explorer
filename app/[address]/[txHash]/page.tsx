import TransactionHash from '@/components/TransactionHash';
import { getTxByTxnHash } from '@/lib/api';
import { notFound } from 'next/navigation';

const page = async ({ params: { txHash } }: { params: { txHash: string } }) => {
  if (!txHash) return notFound();
  const txResp = await getTxByTxnHash(txHash);
  return (
    <div className="flex items-center p-4 lg:max-w-[100%] max-w-full text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
      <TransactionHash txResp={txResp} />
    </div>
  );
};

export default page;
