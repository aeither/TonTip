import { TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useTelegramWebApp } from "../hooks/useTelegramWebApp";
import { Link } from "@tanstack/react-router";

export function TonWalletConnection() {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { webApp, isLoading } = useTelegramWebApp();

  const handleDisconnect = () => {
    tonConnectUI.disconnect();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#282c34] text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        <p className="mt-4">Loading Telegram Mini App...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#282c34] text-white p-4">
      <div className="max-w-md w-full bg-[#3a3f47] rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">TonTip Mini App</h1>
        
        {webApp && (
          <div className="mb-4 text-sm text-gray-300">
            <p>Platform: {webApp.platform}</p>
            <p>Version: {webApp.version}</p>
          </div>
        )}
        
        <div className="mb-6">
          <TonConnectButton />
        </div>

        {wallet ? (
          <div className="space-y-4">
            <div className="bg-[#4a5058] rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Connected Wallet</h2>
              <p className="text-sm text-gray-300 mb-2">Address:</p>
              <p className="text-xs font-mono bg-[#2a2d34] p-2 rounded break-all">
                {wallet.account.address}
              </p>
              <p className="text-sm text-gray-300 mt-2">Chain:</p>
              <p className="text-sm">{wallet.account.chain}</p>
            </div>
            
            {/* Navigation to contract pages */}
            <div className="bg-[#4a5058] rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Contract Interactions</h3>
              <div className="space-y-2">
                <Link 
                  to="/hello-world" 
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors text-center"
                >
                  HelloWorld Contract
                </Link>
                <Link 
                  to="/reward-contract" 
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition-colors text-center"
                >
                  Reward Contract
                </Link>
              </div>
            </div>
            
            <button
              onClick={handleDisconnect}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-gray-400">Connect your TON wallet to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}