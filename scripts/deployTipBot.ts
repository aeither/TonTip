import { toNano } from '@ton/core';
import { TipBot } from '../build/TipBot/TipBot_TipBot';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const tipBot = provider.open(await TipBot.fromInit(provider.sender().address!));

    await tipBot.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(tipBot.address);

    console.log('TipBot deployed at:', tipBot.address.toString());
    console.log('Owner:', provider.sender().address!.toString());
    console.log('Total tips:', await tipBot.getTotalTips());
}