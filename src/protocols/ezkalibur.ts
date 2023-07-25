import { Transaction } from '../services/explorer.ts';
import { ProtocolState } from '../components/ProtocolsCard.tsx';
import { countTransactionPeriods } from '../utils/utils.ts';

const addresses: string[] = [
  '0x17a48ce80a7f7f3f774390179b1a404ce9c9a77e',
  '0x15c664a62086c06d43e75bb3fdded93008b8ce63',
  '0x498f7bb59c61307de7dea005877220e4406470e9',
  '0x240f765af2273b0cab6caff2880d6d8f8b285fa4',
  '0x11ef47783740b3f0c9736d54be8ef8953c3ead99',
  '0xe67d7d52adb6a14c64b9b1ff8dfec081dd12295e',
  '0x6a6d643bdb63bc4d74d166abee57b1be5b3aa9ab',
];

export const Ezkalibur = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: ProtocolState = {
      name: 'Ezkalibur',
      id: 'ezkalibur',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      approves: 0,
      url: 'https://dapp.ezkalibur.com',
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
