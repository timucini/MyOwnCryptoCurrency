const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST'
};

class RedisPattern {
    constructor() {
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();
        
        this.subscriber.subscribe(CHANNELS.TEST);

        // subscribers get notified whenever a messeage is fired
        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
    }

    handleMessage(channel, message) {
        console.log(`Resceived Message: ${message} on Channel: ${channel}`)
    }
}

const test = new RedisPattern();

setTimeout(() => test.publisher.publish(CHANNELS.TEST, 'testmessage'),1000);