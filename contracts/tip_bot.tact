
import "@stdlib/deploy";
import "@stdlib/ownable";

message TipMessage {
    amount: Int as coins;
    recipient: Address;
    sender: Address;
}

message TipNotification {
    amount: Int as coins;
    from: Address;
    message: String;
}

contract TipBot with Deployable, Ownable {
    owner: Address;
    totalTips: Int as coins;
    
    init(owner: Address) {
        self.owner = owner;
        self.totalTips = 0;
    }
    
    receive(msg: TipMessage) {
        require(msg.amount > 0, "Tip amount must be positive");
        
        // Forward the tip to recipient
        send(SendParameters{
            to: msg.recipient,
            value: msg.amount,
            mode: SendPayGasSeparately,
            body: TipNotification{
                amount: msg.amount,
                from: msg.sender,
                message: "You received a tip!"
            }.toCell()
        });
        
        // Update statistics
        self.totalTips = self.totalTips + msg.amount;
        
        // Emit event for tracking
        emit("tip_sent".asComment());
    }
    
    get fun getTotalTips(): Int {
        return self.totalTips;
    }
}