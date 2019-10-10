const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class RedisPattern {
    constructor({ blockchain, transactionPool }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        
        //subscribe to every channel from channels
        this.subscribeToChannels();

        // subscribers get notified whenever a messeage is fired
        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    }

    handleMessage(channel, message) {
        console.log(`Resceived Message: ${message} on Channel: ${channel}`);

        const parsedMessage = JSON.parse(message);

        // to handle incoming channel
        switch(channel) {
             // channel is blockchain, try to update the blockchain
            case CHANNELS.BLOCKCHAIN:
            // this check the validation and lenght of the blockchain
            // we set validateTransaction to true, so the chain gets checked for valid transactions
                this.blockchain.replaceChain(parsedMessage, true, () => {
                    // if we replace our local chain, we also want to empty our transactionPool for this chain
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    });
                });
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMessage);
                break;
            default:
                return;
        }
    }
    subscribeToChannels() {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        })
    }
    // a workaround to avoid that publisher always publish a message to itself
    publish({ channel, message }) {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            })
        })
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = RedisPattern;