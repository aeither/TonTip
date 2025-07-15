import { type NetworkProvider, sleep } from '@ton/blueprint';
import { Address, toNano } from '@ton/core';
import { TipBot } from '../build/TipBot/TipBot_TipBot';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('TipBot address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const tipBot = provider.open(TipBot.fromAddress(address));

    // Get initial total tips
    const totalTipsBefore = await tipBot.getGetTotalTips();
    ui.write(`Total tips before: ${totalTipsBefore.toString()} nanoTON`);

    // Get recipient address
    const recipientAddress = Address.parse(await ui.input('Recipient address'));
    const tipAmount = await ui.input('Tip amount in TON');
    const senderAddress = provider.sender().address;

    ui.write(`Sending tip of ${tipAmount} TON from ${senderAddress} to ${recipientAddress}`);

    // Send tip message
    await tipBot.send(
        provider.sender(),
        {
            value: toNano('0.1'), // Gas fee for forwarding
        },
        {
            $type: 'TipMessage',
            amount: toNano(tipAmount),
            recipient: recipientAddress,
            sender: senderAddress,
        }
    );

    ui.write('Waiting for tip to be processed...');

    // Check if total tips increased
    let totalTipsAfter = await tipBot.getGetTotalTips();
    let attempt = 1;
    while (totalTipsAfter === totalTipsBefore) {
        ui.setActionPrompt(`Attempt ${attempt}`);
        await sleep(2000);
        totalTipsAfter = await tipBot.getGetTotalTips();
        attempt++;
    }

    ui.clearActionPrompt();
    ui.write(`Tip sent successfully! Total tips now: ${totalTipsAfter.toString()} nanoTON`);
}