// Configuration for TonConnect
export const getManifestUrl = () => {
  // Check if we're in production/ngrok environment
  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  
  // If we're using ngrok or a custom domain, use that
  if (currentHost.includes('ngrok')) {
    return `${currentHost}/tonconnect-manifest.json`;
  }
  
  // Default to the ngrok URL you provided
  return 'https://basically-enough-clam.ngrok-free.app/tonconnect-manifest.json';
};

export const getTwaReturnUrl = () => {
  // Update this with your actual Telegram bot URL
  return 'https://t.me/your_bot_name/app';
};