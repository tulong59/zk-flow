import { Transaction } from '../services/explorer.ts';
import { ProtocolState } from '../components/ProtocolsCard.tsx';
import { countTransactionPeriods } from '../utils/utils.ts';

const addresses: string[] = [
  '0xf8b59f3c3ab33200ec80a8a58b2aa5f5d2a8944c',
  '0xa815e2ed7f7d5b0c49fda367f249232a1b9d2883',
  '0x5aeaf2883fbf30f3d62471154eda3c0c1b05942d',
  '0xd03d8d566183f0086d8d09a84e1e30b58dd5619d',
];

export const PancakeSwap = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: ProtocolState = {
      name: 'PancakeSwap',
      id: 'pancakeswap',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      approves: 0,
      url: 'https://pancakeswap.finance/?chain=zkSync',
    };

    transactions.forEach((transaction: Transaction) => {
      if (addresses.includes(transaction.to.toLowerCase()) || addresses.includes(transaction.from.toLowerCase())) {
        if (protocolState.lastActivity === '') protocolState.lastActivity = transaction.receivedAt;
        if (new Date(protocolState.lastActivity) < new Date(transaction.receivedAt))
          protocolState.lastActivity = transaction.receivedAt;
        protocolState.interactions += 1;

        const transfers = transaction.transfers.sort(
          (a, b) =>
            parseInt(b.amount) * 10 ** -b.token.decimals * b.token.price -
            parseInt(a.amount) * 10 ** -a.token.decimals * a.token.price,
        );

        if (transfers.length === 0) return;
        protocolState.volume +=
          parseInt(transfers[0].amount) * 10 ** -transfers[0].token.decimals * transfers[0].token.price;
      }
    });

    protocolState.activeDays = countTransactionPeriods(address, transactions, protocolState.id, addresses).days;

    return protocolState;
  },
};
