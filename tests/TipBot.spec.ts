import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address } from '@ton/core';
import { TipBot } from '../build/TipBot/TipBot_TipBot';
import '@ton/test-utils';

describe('TipBot', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let tipBot: SandboxContract<TipBot>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        deployer = await blockchain.treasury('deployer');

        tipBot = blockchain.openContract(await TipBot.fromInit(deployer.address));

        const deployResult = await tipBot.send(
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
            to: tipBot.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and tipBot are ready to use
    });

    it('should initialize with zero total tips', async () => {
        const totalTips = await tipBot.getGetTotalTips();
        expect(totalTips).toBe(0n);
    });

    it('should send tip and update total tips', async () => {
        const sender = await blockchain.treasury('sender');
        const recipient = await blockchain.treasury('recipient');
        const tipAmount = toNano('1.0');

        const totalTipsBefore = await tipBot.getGetTotalTips();
        const recipientBalanceBefore = await recipient.getBalance();

        console.log('Total tips before:', totalTipsBefore);
        console.log('Recipient balance before:', recipientBalanceBefore);

        const tipResult = await tipBot.send(
            sender.getSender(),
            {
                value: toNano('1.2'), // tip amount + gas
            },
            {
                $$type: 'TipMessage',
                amount: tipAmount,
                recipient: recipient.address,
                sender: sender.address,
            }
        );

        expect(tipResult.transactions).toHaveTransaction({
            from: sender.address,
            to: tipBot.address,
            success: true,
        });

        // Check that tip was forwarded to recipient
        expect(tipResult.transactions).toHaveTransaction({
            from: tipBot.address,
            to: recipient.address,
            success: true,
        });

        const totalTipsAfter = await tipBot.getGetTotalTips();
        const recipientBalanceAfter = await recipient.getBalance();

        console.log('Total tips after:', totalTipsAfter);
        console.log('Recipient balance after:', recipientBalanceAfter);

        expect(totalTipsAfter).toBe(totalTipsBefore + tipAmount);
        expect(recipientBalanceAfter).toBeGreaterThan(recipientBalanceBefore);
    });

    it('should handle multiple tips', async () => {
        const sender1 = await blockchain.treasury('sender1');
        const sender2 = await blockchain.treasury('sender2');
        const recipient = await blockchain.treasury('recipient');
        
        const tipAmount1 = toNano('0.5');
        const tipAmount2 = toNano('1.5');

        // Send first tip
        await tipBot.send(
            sender1.getSender(),
            {
                value: toNano('0.7'),
            },
            {
                $$type: 'TipMessage',
                amount: tipAmount1,
                recipient: recipient.address,
                sender: sender1.address,
            }
        );

        // Send second tip
        await tipBot.send(
            sender2.getSender(),
            {
                value: toNano('1.7'),
            },
            {
                $$type: 'TipMessage',
                amount: tipAmount2,
                recipient: recipient.address,
                sender: sender2.address,
            }
        );

        const totalTips = await tipBot.getGetTotalTips();
        expect(totalTips).toBe(tipAmount1 + tipAmount2);
    });

    it('should reject zero amount tips', async () => {
        const sender = await blockchain.treasury('sender');
        const recipient = await blockchain.treasury('recipient');

        const tipResult = await tipBot.send(
            sender.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'TipMessage',
                amount: 0n,
                recipient: recipient.address,
                sender: sender.address,
            }
        );

        expect(tipResult.transactions).toHaveTransaction({
            from: sender.address,
            to: tipBot.address,
            success: false,
        });
    });
});