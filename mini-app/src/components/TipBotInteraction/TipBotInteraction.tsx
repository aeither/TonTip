import React, { useState } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { useTipBotContract } from '../../hooks/useTipBotContract';
import { useTipBotData } from '../../hooks/useTipBotData';
import './style.scss';

export function TipBotInteraction() {
  const { sendTipMessage, connected } = useTipBotContract();
  const { totalTips, loading, error } = useTipBotData();
  const userAddress = useTonAddress();
  
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendTip = async () => {
    if (!amount || !recipientAddress) {
      alert('Please fill in all fields');
      return;
    }

    if (!userAddress) {
      alert('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      await sendTipMessage(amount, recipientAddress, userAddress);
      alert('Tip sent successfully!');
      setAmount('');
      setRecipientAddress('');
    } catch (error) {
      alert('Transaction failed');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tip-bot-container">
      <div className="tip-bot-header">
        <h1>💎 TonTip</h1>
        <p>Send tips to your favorite creators on TON blockchain</p>
      </div>
      
      <div className="wallet-section">
        <TonConnectButton />
      </div>
      
      <div className="stats-section">
        <h3>Contract Statistics</h3>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        {totalTips && <p>Total Tips: {totalTips} TON</p>}
      </div>
      
      {connected && (
        <div className="tip-form">
          <div className="form-group">
            <label htmlFor="tip-amount">Tip Amount (TON):</label>
            <input
              id="tip-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter tip amount in TON"
              className="form-input"
              disabled={!connected}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="recipient-address">Recipient Address:</label>
            <input
              id="recipient-address"
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="Enter recipient TON address"
              className="form-input"
              disabled={!connected}
            />
          </div>
          
          <button 
            type="button"
            onClick={handleSendTip}
            disabled={!connected || isLoading}
            className="send-tip-button"
          >
            {isLoading ? 'Sending...' : 'Send Tip'}
          </button>
        </div>
      )}
      
      {!connected && (
        <div className="connect-prompt">
          <p>Connect your wallet to start sending tips!</p>
        </div>
      )}
    </div>
  );
}