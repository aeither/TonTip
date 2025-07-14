import { useState, useEffect } from 'react';
import { TonClient } from '@ton/ton';
import { Address } from '@ton/core';
import { tonClientConfig, config } from '../utils/config';

export function useTipBotData() {
  const [totalTips, setTotalTips] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!config.contractAddress) return;

      setLoading(true);
      setError(null);

      try {
        const client = new TonClient(tonClientConfig);
        const address = Address.parse(config.contractAddress);
        
        const result = await client.runMethod(address, 'getTotalTips');
        const value = result.stack.readBigNumber();
        
        setTotalTips((Number(value) / 1e9).toFixed(4));
      } catch (error) {
        setError('Failed to fetch contract data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return { totalTips, loading, error };
} 