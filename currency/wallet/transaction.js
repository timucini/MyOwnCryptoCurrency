// v1 generate a unique key based on the timestamp
const uuid = require('uuid/v1');

class Transaction {
    constructor({ senderWallet, recipient, amount}) {
        //transaction have an ID
        this.id = uuid();
        // transaction create Output
        this.outputMap = this.createOutputMap({ senderWallet,recipient,amount});
        
        //transaction need input
        this.input = this.createInput({senderWallet,outputMap: this.outputMap});

    }
    // create the output of a transactioon
    createOutputMap({ senderWallet, recipient, amount}) {
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }
    createInput({ senderWallet, outputMap}) {
        return{
            // transaction input needs timestamp
            timestamp: Date.now(),
            // and a amount
            amount: senderWallet.balance,
            // and a adress
            adress: senderWallet.publicKey,
            // and a signature by signing the output
            signature: senderWallet.sign(outputMap)
        };
    }
}
module.exports = Transaction;