const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
const { REWARD_INPUT, MINING_REWARD} = require('../config');

class Transaction {
    constructor({ senderWallet, recipient, amount, outputMap, input }) {
        this.id = uuid();
        // if outputmap is defined we use that -> for the rewardTransaction
        this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount});
        // if input is defindes we use that -> for the rewardTransaction
        this.input = input || this.createInput({senderWallet,outputMap: this.outputMap });
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

        // recipient doesnt exist in the outputMap
        if (!this.outputMap[recipient]) {
            // new amount for the recipient = transaction  +amount
            this.outputMap[recipient] = amount;
        } else {
            // recipient alredy exists in the outputMap
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }

        // new amount of the senderwallet = -transaction-amount
        this.outputMap[senderWallet.publicKey] =   this.outputMap[senderWallet.publicKey] - amount;

        // this creates a new signature
        this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
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
        // add a miner-Reward for the MinerWallet publicKey
        return new this({
            input: REWARD_INPUT,
            outputMap: { [minerWallet.publicKey]: MINING_REWARD }
        });
    }
}

module.exports = Transaction;