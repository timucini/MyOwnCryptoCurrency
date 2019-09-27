const PubNub = require('pubnub');

const credentials = {
    publishKey: 'pub-c-88d0417f-46bd-43da-8220-5fcbd1f6be29',
    subscribeKey: 'sub-c-e32b41aa-e0a2-11e9-87e1-4690e5f445a1',
    secretKey: 'sec-c-ZGUzZjlkMDQtOWUxOS00MjdlLWEzMGItZjY0YTcxNTMyOGIx'
};
const CHANNELS = {
    TEST: 'TESTVALUE',
    BLOCKCHAIN : 'Blockchain'
};


const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
  };
  
class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
      this.blockchain = blockchain;
      this.transactionPool = transactionPool;
      this.wallet = wallet;
  
      this.pubnub = new PubNub(credentials);
  
      this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });
  
      this.pubnub.addListener(this.listener());
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
  
    subscribeToChannels() {
      this.pubnub.subscribe({
        channels: [Object.values(CHANNELS)]
      });
    }
  
    listener() {
      return {
        message: messageObject => {
          const { channel, message } = messageObject;
  
          console.log(`Message received. Channel: ${channel}. Message: ${message}`);
          const parsedMessage = JSON.parse(message);
  
          switch(channel) {
            case CHANNELS.BLOCKCHAIN:
              this.blockchain.replaceChain(parsedMessage, true, () => {
                this.transactionPool.clearBlockchainTransactions(
                  { chain: parsedMessage.chain }
                );
              });
              break;
            case CHANNELS.TRANSACTION:
              if (!this.transactionPool.existingTransaction({
                inputAddress: this.wallet.publicKey
              })) {
                this.transactionPool.setTransaction(parsedMessage);
              }
              break;
            default:
              return;
          }
        }
      }
    }
  
    publish({ channel, message }) {
      // there is an unsubscribe function in pubnub
      // but it doesn't have a callback that fires after success
      // therefore, redundant publishes to the same local subscriber will be accepted as noisy no-ops
      this.pubnub.publish({ message, channel });
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
  cons

  module.exports = PubSub;