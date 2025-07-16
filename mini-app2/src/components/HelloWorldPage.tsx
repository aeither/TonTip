import React, { useState, useEffect } from "react";
import {
  TonConnectButton,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { TonClient, Address, toNano } from "@ton/ton";
import { Link } from "@tanstack/react-router";
import { HelloWorld, storeAdd } from "../contracts/HelloWorld_HelloWorld";
import { beginCell } from "@ton/core";

const CONTRACT_ADDRESS = "EQDmj9bqTleRjqQ2PpuLEwhFzNJPL2_4SxPQF2l3AkAwGEtn";

export const HelloWorldPage: React.FC = () => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [counter, setCounter] = useState<number | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [addAmount, setAddAmount] = useState(1);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize TON client and contract
  const tonClient = new TonClient({ 
    endpoint: "https://toncenter.com/api/v2/jsonRPC"
  });
  const contractAddress = Address.parse(CONTRACT_ADDRESS);
  const contract = HelloWorld.fromAddress(contractAddress);

  const fetchContractData = async () => {
    try {
      setIsLoading(true);
      
      // Use the contract wrapper to get counter and id
      const provider = tonClient.provider(contractAddress);
      const counterResult = await contract.getCounter(provider);
      const idResult = await contract.getId(provider);
      
      setCounter(Number(counterResult));
      setId(Number(idResult));
      setStatus("Contract data loaded successfully");
    } catch (err) {
      console.error("Failed to fetch contract data:", err);
      setStatus(`Failed to fetch contract data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
    // Fetch every 10 seconds for auto-update
    const interval = setInterval(fetchContractData, 10000);
    return () => clearInterval(interval);
  }, []);

  const onAddClick = async () => {
    if (!wallet) {
      setStatus("Please connect your TON wallet first.");
      return;
    }

    if (addAmount <= 0 || addAmount > 0xffffffff) {
      setStatus("Please enter a valid amount (1 to 4294967295)");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Preparing transaction...");

      // Build the payload using the generated contract wrapper
      const addMessage = {
        $$type: 'Add' as const,
        amount: BigInt(addAmount)
      };
      
      const payload = beginCell()
        .store(storeAdd(addMessage))
        .endCell();

      // Prepare transaction for TonConnect
      const tx = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes
        messages: [
          {
            address: CONTRACT_ADDRESS,
            amount: toNano("0.05").toString(), // 0.05 TON for gas
            payload: payload.toBoc().toString("base64"),
          },
        ],
      };

      setStatus("Sending transaction...");
      await tonConnectUI.sendTransaction(tx);
      setStatus("Transaction sent! Waiting for confirmation...");
      
      // Refresh contract data after a short delay
      setTimeout(() => {
        fetchContractData();
      }, 3000);
      
    } catch (e) {
      console.error("Transaction failed:", e);
      setStatus("Transaction failed: " + (e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#282c34] text-white p-4">
      <div className="max-w-md mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-[#3a3f47] rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">HelloWorld Contract</h1>
          <TonConnectButton />
        </div>

        {/* Contract Info */}
        <div className="bg-[#3a3f47] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Contract Information</h2>
          <div className="space-y-2">
            <div>
              <span className="text-gray-400">Connected Wallet:</span>
              <p className="font-mono text-sm break-all">
                {wallet?.account.address || "None"}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Contract Address:</span>
              <p className="font-mono text-sm break-all">{CONTRACT_ADDRESS}</p>
            </div>
            <div>
              <span className="text-gray-400">Contract ID:</span>
              <p className="text-xl font-bold">{id !== null ? id : "Loading..."}</p>
            </div>
            <div>
              <span className="text-gray-400">Contract Counter:</span>
              <p className="text-xl font-bold">{counter !== null ? counter : "Loading..."}</p>
            </div>
          </div>
          
          <button
            onClick={fetchContractData}
            disabled={isLoading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            {isLoading ? "Loading..." : "Refresh Data"}
          </button>
        </div>

        {/* Add Transaction */}
        <div className="bg-[#3a3f47] rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add to Counter</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onAddClick();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Amount to Add:
              </label>
              <input
                type="number"
                value={addAmount}
                min={1}
                max={0xffffffff}
                onChange={(e) => setAddAmount(Number(e.target.value))}
                className="w-full bg-[#2a2d34] border border-gray-600 rounded px-3 py-2 text-white"
                placeholder="Enter amount"
              />
            </div>
            <button
              type="submit"
              disabled={!wallet || isLoading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {isLoading ? "Processing..." : "Send Add Transaction"}
            </button>
          </form>
        </div>

        {/* Status */}
        {status && (
          <div className="bg-[#3a3f47] rounded-lg p-4">
            <h3 className="text-sm font-semibold mb-2">Status:</h3>
            <p className="text-sm text-gray-300">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};