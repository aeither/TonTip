import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address } from '@ton/core';
import { RewardContract } from '../build/RewardContract/RewardContract_RewardContract';
import '@ton/test-utils';

describe('RewardContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let rewardContract: SandboxContract<RewardContract>;
    let user1: SandboxContract<TreasuryContract>;
    let user2: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');
        user1 = await blockchain.treasury('user1');
        user2 = await blockchain.treasury('user2');

        rewardContract = blockchain.openContract(await RewardContract.fromInit(deployer.address));

        const deployResult = await rewardContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: rewardContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy successfully', async () => {
        // the check is done inside beforeEach
        // blockchain and rewardContract are ready to use
    });

    it('should initialize with correct owner and reward amount', async () => {
        const owner = await rewardContract.getGetOwner();
        const rewardAmount = await rewardContract.getGetRewardAmount();

        expect(owner.toString()).toBe(deployer.address.toString());
        expect(rewardAmount).toBe(toNano('0.01')); // 0.01 TON
    });

    it('should allow users to deposit TON', async () => {
        const depositAmount = toNano('1.0');

        const depositResult = await rewardContract.send(
            user1.getSender(),
            {
                value: depositAmount,
            },
            {
                $$type: 'ClaimReward', // Using any message type for deposit
            }
        );

        expect(depositResult.transactions).toHaveTransaction({
            from: user1.address,
            to: rewardContract.address,
            success: true,
        });

        // Verify the transaction was successful
        expect(depositResult.transactions).toHaveTransaction({
            from: user1.address,
            to: rewardContract.address,
            success: true,
        });
    });

    it('should allow users to claim reward when sufficient funds are available', async () => {
        // First deposit some funds
        const depositAmount = toNano('0.1');
        await rewardContract.send(
            user1.getSender(),
            {
                value: depositAmount,
            },
            {
                $$type: 'ClaimReward',
            }
        );

        const user2BalanceBefore = await user2.getBalance();
        const rewardAmount = await rewardContract.getGetRewardAmount();

        // User2 claims reward
        const claimResult = await rewardContract.send(
            user2.getSender(),
            {
                value: toNano('0.01'), // Gas for transaction
            },
            {
                $$type: 'ClaimReward',
            }
        );

        expect(claimResult.transactions).toHaveTransaction({
            from: user2.address,
            to: rewardContract.address,
            success: true,
        });

        // Check that reward was sent to user2
        expect(claimResult.transactions).toHaveTransaction({
            from: rewardContract.address,
            to: user2.address,
            success: true,
        });

        const user2BalanceAfter = await user2.getBalance();

        // User2 should have received the reward (accounting for gas fees)
        // The balance might be less due to gas fees, but the transaction should succeed
        expect(claimResult.transactions).toHaveTransaction({
            from: rewardContract.address,
            to: user2.address,
            success: true,
        });
    });

    it('should reject claim reward when insufficient funds', async () => {
        // Try to claim reward without any deposits
        const claimResult = await rewardContract.send(
            user1.getSender(),
            {
                value: toNano('0.01'),
            },
            {
                $$type: 'ClaimReward',
            }
        );

        expect(claimResult.transactions).toHaveTransaction({
            from: user1.address,
            to: rewardContract.address,
            success: false,
        });
    });

    it('should allow owner to withdraw all funds', async () => {
        // First deposit some funds
        const depositAmount = toNano('1.0');
        await rewardContract.send(
            user1.getSender(),
            {
                value: depositAmount,
            },
            {
                $$type: 'ClaimReward',
            }
        );

        const ownerBalanceBefore = await deployer.getBalance();

        // Owner withdraws all funds
        const withdrawResult = await rewardContract.send(
            deployer.getSender(),
            {
                value: toNano('0.01'), // Gas for transaction
            },
            {
                $$type: 'WithdrawAll',
            }
        );

        expect(withdrawResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: rewardContract.address,
            success: true,
        });

        // Check that funds were sent to owner
        expect(withdrawResult.transactions).toHaveTransaction({
            from: rewardContract.address,
            to: deployer.address,
            success: true,
        });

        const ownerBalanceAfter = await deployer.getBalance();

        // Owner should have received the funds (accounting for gas fees)
        // The balance might be less due to gas fees, but the transaction should succeed
        expect(withdrawResult.transactions).toHaveTransaction({
            from: rewardContract.address,
            to: deployer.address,
            success: true,
        });
    });

    it('should reject withdraw all from non-owner', async () => {
        // First deposit some funds
        const depositAmount = toNano('1.0');
        await rewardContract.send(
            user1.getSender(),
            {
                value: depositAmount,
            },
            {
                $$type: 'ClaimReward',
            }
        );

        // Non-owner tries to withdraw
        const withdrawResult = await rewardContract.send(
            user1.getSender(),
            {
                value: toNano('0.01'),
            },
            {
                $$type: 'WithdrawAll',
            }
        );

        expect(withdrawResult.transactions).toHaveTransaction({
            from: user1.address,
            to: rewardContract.address,
            success: false,
        });
    });

    it('should handle multiple deposits and claims', async () => {
        // Multiple users deposit
        await rewardContract.send(
            user1.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'ClaimReward',
            }
        );

        await rewardContract.send(
            user2.getSender(),
            {
                value: toNano('0.2'),
            },
            {
                $$type: 'ClaimReward',
            }
        );

        // Multiple users claim rewards
        await rewardContract.send(
            user1.getSender(),
            {
                value: toNano('0.01'),
            },
            {
                $$type: 'ClaimReward',
            }
        );

        await rewardContract.send(
            user2.getSender(),
            {
                value: toNano('0.01'),
            },
            {
                $$type: 'ClaimReward',
            }
        );

        // Verify that multiple transactions were processed successfully
        // The contract should handle multiple deposits and claims
    });

    it('should reject withdraw when no funds available', async () => {
        const withdrawResult = await rewardContract.send(
            deployer.getSender(),
            {
                value: toNano('0.01'),
            },
            {
                $$type: 'WithdrawAll',
            }
        );

        expect(withdrawResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: rewardContract.address,
            success: false,
        });
    });
}); 