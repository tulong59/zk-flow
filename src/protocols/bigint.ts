import { Transaction } from '../services/explorer.ts';
import { ProtocolState } from '../components/ProtocolsCard.tsx';
import { countTransactionPeriods } from '../utils/utils.ts';

const addresses: string[] = ['0x4476e0c7b72d5ba0dab70b6cc9d0b518c265f01c'];

export const Bigint = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: ProtocolState = {
      name: 'BigInt',
      id: 'bigint',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      approves: 0,
      url: 'https://bigint.co/',
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
