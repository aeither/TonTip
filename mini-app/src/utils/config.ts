export const config = {
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  tonNetwork: process.env.REACT_APP_TON_NETWORK || 'testnet',
  telegramBotToken: process.env.REACT_APP_TELEGRAM_BOT_TOKEN || '',
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001'
};

export const tonClientConfig = {
  endpoint: config.tonNetwork === 'mainnet' 
    ? 'https://toncenter.com/api/v2/jsonRPC'
    : 'https://testnet.toncenter.com/api/v2/jsonRPC'
};