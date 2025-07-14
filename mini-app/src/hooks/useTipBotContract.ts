import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address, beginCell, toNano } from '@ton/core';
import { config } from '../utils/config';

export function useTipBotContract() {
  const [tonConnectUI] = useTonConnectUI();

  const sendTipMessage = async (
    amount: string, 
    recipientAddress: string, 
    senderAddress: string
  ) => {
    const body = beginCell()
      .storeCoins(toNano(amount))
      .storeAddress(Address.parse(recipientAddress))
      .storeAddress(Address.parse(senderAddress))
      .endCell();

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: config.contractAddress,
          amount: toNano("0.1").toString(),
          payload: body.toBoc().toString("base64")
        }
      ]
    };

    return await tonConnectUI.sendTransaction(transaction);
  };

  return {
    sendTipMessage,
    connected: tonConnectUI.connected
  };
} 