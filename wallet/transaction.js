const uuid = require('uuid/v1');
const { verifySignature } = require('../cryptography/cryptography');
const { REWARD_INPUT, MINING_REWARD} = require('../config');

class Transaction {
    constructor({ senderWallet, recipient, amount, outputMap, input }) {
        this.id = uuid();
        // if outputMap is defined, defined one will be used (case for the reward-transaction)
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount});
        // if input is defined, defined one will be used (case for the reward-transaction)
        this.input = input || this.createInput({senderWallet,outputMap: this.outputMap });
    }
    static validTransaction(transaction) {
        const { input: { address, amount, signature}, outputMap } = transaction;

       const outputTotal = Object.values(outputMap)
        .reduce((total, outputAmount) => total + outputAmount);

        if(amount !== outputTotal) {
            console.error(`Invalid transaction from ${address}`);
            return false;
        }
        if(!verifySignature({ publicKey: address, data: outputMap, signature})) {
            console.error(`Invalid signature from ${address}`);
            return false;
        }

        return true;
    }

    static rewardTransaction({ minerWallet}) {
        // add a miner-Reward for the Miner-Wallet publicKey
        return new this({
            input: REWARD_INPUT,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD }
        });
    }
    createOutputMap({ senderWallet, recipient, amount }) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }
    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    update({ senderWallet, recipient , amount}) {

        if (amount > this.outputMap[senderWallet.publicKey]) {
            throw new Error('Amount exceeds balance');
        }

        // recipient doesn't exist in the outputMap
        if (!this.outputMap[recipient]) {
            // new amount for the recipient = transaction + amount
            this.outputMap[recipient] = amount;
        } else {
            // recipient alredy exists in the outputMap
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        // new amount of the senderwallet = transaction-amount
        this.outputMap[senderWallet.publicKey] =   this.outputMap[senderWallet.publicKey] - amount;

        // this creates a new signature
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    }
}

module.exports = Transaction;