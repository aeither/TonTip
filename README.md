# TonTip - TON Blockchain Quiz & Reward Platform

## Tagline
TonTip is a Telegram Mini App that combines interactive quizzes with TON blockchain rewards, enabling users to earn cryptocurrency while learning. Built with modern web technologies and smart contracts, it creates an engaging educational experience within Telegram's ecosystem.

## What it does

TonTip is a comprehensive Telegram Mini App that offers:

- **Interactive Quiz System**: Users can take educational quizzes on various topics with multiple-choice questions
- **Blockchain Rewards**: Successful quiz completion earns users TON cryptocurrency through smart contracts
- **Smart Contract Integration**: Automated reward distribution using TON blockchain smart contracts
- **Telegram Integration**: Seamless experience within Telegram's WebApp environment
- **Wallet Connection**: Direct integration with TON wallets for secure transactions
- **Progress Tracking**: Users can track their quiz progress and claimed rewards
- **Modern UI**: Beautiful glass morphism design with responsive layout

## The problem it solves

- **Educational Engagement**: Traditional learning platforms lack financial incentives
- **Blockchain Adoption**: Complex blockchain interactions need user-friendly interfaces
- **Telegram Ecosystem**: Limited educational apps within Telegram's Mini App platform
- **Reward Distribution**: Manual reward systems are inefficient and prone to errors
- **User Onboarding**: New users need simple ways to interact with blockchain technology

## TON Blockchain Integration

### Smart Contracts

TonTip uses three main smart contracts built with the **Tact language**:

#### 1. Reward Contract (`contracts/reward_contract.tact`)
- **Purpose**: Manages quiz rewards and fund distribution
- **Key Features**:
  - Accepts user deposits (TON contributions)
  - Distributes 0.01 TON rewards for perfect quiz completion
  - Owner-only withdrawal functionality
  - Secure transaction validation
- **Contract Address**: `EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG`
- **Reward Amount**: 0.01 TON per perfect quiz completion

#### 2. HelloWorld Contract (`contracts/hello_world.tact`)
- **Purpose**: Simple counter contract for testing blockchain interactions
- **Key Features**:
  - Incrementable counter
  - Basic smart contract interaction testing
  - Gas estimation validation
- **Contract Address**: `EQDmj9bqTleRjqQ2PpuLEwhFzNJPL2_4SxPQF2l3AkAwGEtn`

#### 3. TipBot Contract (`contracts/tip_bot.tact`)
- **Purpose**: Facilitates TON tipping between users
- **Key Features**:
  - Secure tip forwarding
  - Transaction notifications
  - Tip statistics tracking

### Wallet Integration

TonTip integrates with TON wallets through **TonConnect 2.0**:

#### Supported Wallets
- **Tonkeeper**: Primary wallet with full feature support
- **TON Wallet**: Chrome extension wallet
- **Nicegram Wallet**: Integrated wallet within Nicegram app

#### Connection Flow
1. User clicks "Connect Wallet" button
2. TonConnect modal opens with available wallets
3. User selects and authorizes their wallet
4. Wallet connection is established and maintained
5. User can now interact with smart contracts

#### Security Features
- **Manifest Validation**: Ensures secure wallet connections
- **Transaction Signing**: All blockchain transactions require user approval
- **Gas Estimation**: Automatic gas calculation for transactions
- **Error Handling**: Comprehensive error handling for failed transactions

### Smart Contract Interactions

#### Quiz Reward Claiming
```typescript
// User completes quiz with perfect score
// Frontend calls smart contract to claim reward
const payload = encodeClaimRewardMessage();
const tx = {
  validUntil: Math.floor(Date.now() / 1000) + 600,
  messages: [{
    address: REWARD_CONTRACT_ADDRESS,
    amount: toNano("0.05"), // Gas fee
    payload: payload
  }]
};
await tonConnectUI.sendTransaction(tx);
```

#### Contract Deployment
```bash
# Deploy HelloWorld contract
npx blueprint run deployHelloWorld

# Deploy TipBot contract  
npx blueprint run deployTipBot
```

### TON Network Configuration

- **Network**: TON Mainnet
- **RPC Endpoint**: `https://toncenter.com/api/v2/jsonRPC`
- **Gas Fees**: ~0.05 TON per transaction
- **Block Time**: ~5 seconds
- **Transaction Confirmation**: ~10-30 seconds

## MVP Usage Guide

### For Users

#### Getting Started
1. **Access the App**: Open TonTip through Telegram Mini App
2. **Connect Wallet**: Click "Connect Wallet" and select your TON wallet
3. **Browse Quizzes**: View available quizzes on the home page
4. **Take a Quiz**: Select a quiz and answer all questions correctly
5. **Claim Reward**: If you get a perfect score, claim your TON reward

#### Available Quizzes
- **Math Basics** (5 questions, 0.01 TON reward)
- **World History** (5 questions, 0.015 TON reward)  
- **Basic Physics** (5 questions, 0.02 TON reward)
- **Cryptocurrency Basics** (5 questions, 0.025 TON reward)

#### Reward System
- **Perfect Score Required**: Must answer all questions correctly
- **One-Time Claim**: Each quiz can only be claimed once per wallet
- **Automatic Distribution**: Rewards are sent directly to your connected wallet
- **Gas Fees**: Small gas fee (~0.05 TON) required for claiming

#### Troubleshooting
- **Wallet Not Connecting**: Ensure you have a supported TON wallet installed
- **Transaction Fails**: Check your wallet has sufficient TON for gas fees
- **Reward Not Received**: Wait 10-30 seconds for blockchain confirmation

### For Developers

#### Prerequisites
- Node.js 18+
- pnpm package manager
- TON wallet (Tonkeeper, TON Wallet, etc.)
- ngrok for local development

#### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/TonTip.git
cd TonTip

# Install dependencies
pnpm install

# Build smart contracts
npx tact --config tact.config.json

# Start development server
cd mini-app2
pnpm dev
```

#### Testing Smart Contracts

```bash
# Run all tests
npm test

# Test specific contract
npm test -- tests/RewardContract.spec.ts
npm test -- tests/HelloWorld.spec.ts
npm test -- tests/TipBot.spec.ts
```

#### Deploying Contracts

```bash
# Deploy HelloWorld contract
npx blueprint run deployHelloWorld

# Deploy TipBot contract
npx blueprint run deployTipBot

# Test TipBot functionality
npx blueprint run testTipBot
```

#### Telegram Mini App Setup

1. **Configure ngrok** for HTTPS access:
```bash
ngrok http 3000
```

2. **Update manifest URLs** in `mini-app2/src/config/tonconnect.ts`

3. **Set up Telegram Bot** with Mini App configuration

4. **Test in Telegram** using the bot's Mini App

#### Environment Configuration

```typescript
// mini-app2/src/config/tonconnect.ts
export const getManifestUrl = () => {
  const currentHost = window.location.origin;
  
  if (currentHost.includes('ngrok')) {
    return `${currentHost}/tonconnect-manifest.json`;
  }
  
  return 'https://your-ngrok-url.ngrok-free.app/tonconnect-manifest.json';
};
```

### For Contract Owners

#### Managing the Reward Contract

1. **Deposit Funds**: Send TON to the contract address to fund rewards
2. **Monitor Balance**: Check contract balance on TONScan
3. **Withdraw Funds**: Use owner-only withdrawal function if needed

#### Contract Addresses
- **Reward Contract**: `EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG`
- **HelloWorld Contract**: `EQDmj9bqTleRjqQ2PpuLEwhFzNJPL2_4SxPQF2l3AkAwGEtn`

#### Contract Management Commands
```bash
# Check contract balance
npx blueprint run checkBalance --address EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG

# Withdraw funds (owner only)
npx blueprint run withdrawAll --address EQBvW8Z5huBkMJYdnfAEM5JqTNkuWX3diqYENkWsIL0XggGG
```

## Technologies Used

### Frontend
- **React 19** with TypeScript for type-safe development
- **TanStack Router** for modern client-side routing
- **Tailwind CSS** for responsive design and glass morphism effects
- **Vite** for fast development and building
- **TanStack Start** for full-stack React framework

### Blockchain
- **TON Blockchain** for decentralized infrastructure
- **Tact Language** for smart contract development
- **@ton/core** and **@ton/ton** for blockchain interactions
- **TonConnect 2.0** for wallet integration
- **@tonconnect/ui-react** for React wallet components

### Development Tools
- **TypeScript** for type safety
- **Jest** for testing smart contracts
- **BluePrint** for TON development workflow
- **ngrok** for local development with Telegram WebApp

### Infrastructure
- **Telegram Bot API** for Mini App hosting
- **Telegram WebApp SDK** for platform integration
- **Node.js polyfills** for browser compatibility

## Architecture Overview

### Smart Contract Architecture
```
RewardContract
├── User Deposits (TON contributions)
├── Reward Distribution (0.01 TON per perfect quiz)
├── Owner Withdrawal (emergency fund recovery)
└── Event Emission (transaction tracking)

HelloWorld Contract
├── Counter Management
├── Increment Function
└── State Reading

TipBot Contract
├── Tip Forwarding
├── Notification System
└── Statistics Tracking
```

### Frontend Architecture
```
TonTip Mini App
├── Wallet Connection (TonConnect)
├── Quiz System (React components)
├── Reward Claiming (Smart contract interaction)
├── Progress Tracking (Local storage)
└── UI/UX (Tailwind CSS + Glass morphism)
```

### Data Flow
1. **User Action**: User completes quiz with perfect score
2. **Frontend Validation**: Check quiz completion and eligibility
3. **Smart Contract Call**: Encode and send claim transaction
4. **Wallet Approval**: User approves transaction in wallet
5. **Blockchain Processing**: Transaction processed on TON network
6. **Reward Distribution**: TON sent to user's wallet
7. **UI Update**: Update progress and show confirmation

## Security Considerations

### Smart Contract Security
- **Access Control**: Owner-only functions for critical operations
- **Input Validation**: All user inputs are validated
- **Gas Optimization**: Efficient gas usage for cost-effective transactions
- **Error Handling**: Comprehensive error handling and user feedback

### Frontend Security
- **Wallet Validation**: Secure wallet connection through TonConnect
- **Transaction Signing**: All transactions require user approval
- **Data Validation**: Client-side validation for user inputs
- **HTTPS Only**: Secure communication for all API calls

### User Privacy
- **No Personal Data**: No personal information is stored on-chain
- **Wallet Privacy**: Only wallet addresses are used for transactions
- **Local Storage**: Quiz progress stored locally on user's device
- **Telegram Integration**: Leverages Telegram's existing privacy features

## Challenges and Solutions

### Telegram WebApp Limitations
- **Challenge**: Restricted WebView environment
- **Solution**: TonConnect deep linking and universal links

### TON Blockchain Integration
- **Challenge**: Complex smart contract interactions
- **Solution**: Comprehensive error handling and user-friendly UI

### Cross-Platform Compatibility
- **Challenge**: Different devices and Telegram versions
- **Solution**: Responsive design and progressive enhancement

### State Management
- **Challenge**: Complex quiz state and blockchain transactions
- **Solution**: Local storage for progress, real-time blockchain updates

## Future Roadmap

### Short-term Goals (1-3 months)
- **Enhanced Quiz Content**: Add more diverse quiz categories
- **Social Features**: Leaderboards and user achievements
- **Improved UI**: Animations and micro-interactions
- **Mobile Optimization**: Better mobile experience

### Medium-term Goals (3-6 months)
- **Advanced Smart Contracts**: More sophisticated reward mechanisms
- **Quiz Creation**: User-generated quiz content
- **Analytics Dashboard**: Detailed performance analytics
- **Multi-language Support**: Internationalization

### Long-term Vision (6+ months)
- **DAO Governance**: Decentralized content management
- **NFT Integration**: NFT rewards for special achievements
- **Cross-chain Support**: Multi-blockchain compatibility
- **Educational Partnerships**: Institutional content partnerships

## Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests for any improvements.

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for smart contracts
- Maintain consistent code formatting
- Update documentation for new features

### Testing Requirements
- All smart contracts must have Jest tests
- Frontend components should have integration tests
- End-to-end testing for critical user flows
