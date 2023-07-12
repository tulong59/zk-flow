import { Transaction } from '../services/explorer.ts';
import { ProtocolState } from '../components/ProtocolsCard.tsx';
import { countTransactionPeriods } from '../utils/utils.ts';

const xyfinanceAddresses: string[] = [
  '0x936fef4245f281ed4f2ee303060a8656399dcc32',
  '0xada6a5c2ddf499b50efced4c489a90b707693ac5',
  '0xaa0b0654e79e17332d983e2351bd926ce336b9bd',
  '0x935283a00fbf8e40fd2f8c432a488f6addc8db67',
  '0xdf4700daccbfb097204576cbbb4728d4f190fdc1',
  '0x75167284361c8d61be7e4402f4953e2b112233cb',
  '0xc81dc052661785c5a304ebb2c4bceadcfb79a675',
  '0x9e52c2bd0177404dca3e122992a7fc0bcb15fd95',
  '0x83529b846762d1146c251548a3d8e453c1d09424',
  '0xbcdde9ca12f1141943e98249dae5b18a3d885e6b',
  '0x48ca44863861fd0687b3a21211bf90cb5924704e',
  '0xe4e156167cc9c7ac4abd8d39d203a5495f775547',
  '0x30e63157bd0ba74c814b786f6ea2ed9549507b46',
];

export const XYFinance = {
  getProtocolsState: (transactions: Transaction[], address: string) => {
    const protocolState: ProtocolState = {
      name: 'XY Finance',
      id: 'xyfinance',
      lastActivity: '',
      volume: 0,
      interactions: 0,
      activeDays: 0,
      approves: 0,
      url: 'https://xy.finance/',
    };

    transactions.forEach((transaction: Transaction) => {
      if (xyfinanceAddresses.includes(transaction.to.toLowerCase())) {
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

    protocolState.activeDays = countTransactionPeriods(
      address,
      transactions,
      protocolState.id,
      xyfinanceAddresses,
    ).days;

    return protocolState;
  },
};
