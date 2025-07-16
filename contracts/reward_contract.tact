import "@stdlib/deploy";
import "@stdlib/ownable";

message ClaimReward {
    // Empty message body for claiming reward
}

message WithdrawAll {
    // Empty message body for withdrawing all funds
}

contract RewardContract with Deployable, Ownable {
    owner: Address;
    rewardAmount: Int as coins;
    
    init(owner: Address) {
        self.owner = owner;
        self.rewardAmount = 10_000_000; // 0.01 TON in nanotons
    }
    
    // Users can deposit TON by sending a message with TONs attached
    receive() {
        // No action needed; funds are automatically added to contract balance
        // Just emit an event for tracking
        emit("deposit_received".asComment());
    }
    
    // Users can call this to claim 0.01 TON as a reward
    receive(msg: ClaimReward) {
        // Send reward to the caller
        send(SendParameters{
            to: sender(),
            value: self.rewardAmount,
            mode: SendPayGasSeparately,
            body: "Reward claimed!".asComment()
        });
        
        emit("reward_claimed".asComment());
    }
    
    // Only owner can withdraw all funds in the contract
    receive(msg: WithdrawAll) {
        require(sender() == self.owner, "Only owner can withdraw");
        
        // Send all remaining value to owner
        cashback(self.owner);
        
        emit("all_funds_withdrawn".asComment());
    }
    
    get fun getOwner(): Address {
        return self.owner;
    }
    
    get fun getRewardAmount(): Int {
        return self.rewardAmount;
    }
} 