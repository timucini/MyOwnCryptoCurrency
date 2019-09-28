const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

class RedisPattern {
    constructor({ blockchain }) {
        this.blockchain = blockchain;
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

        // channel is blockchain, try to update the blockchain
        if (channel === CHANNELS.BLOCKCHAIN) {
            // this check the validation and lenght of the blockchain
            this.blockchain.replaceChain(parsedMessage);
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
}

module.exports = RedisPattern;