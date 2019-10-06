const Transaction = require('./transaction')
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../util');


class Wallet {
    constructor() {
        // wallet has an balance
        this.balance = STARTING_BALANCE;
        // and a keypair
        this.keyPair = ec.genKeyPair();

        // encode key to its hex-form
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    sign(data) {
        // data is the outputmap for a transaction
        return this.keyPair.sign(cryptoHash(data))
    };
    createTransaction({ recipient, amount }) {
        if ( amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({ senderWallet: this, recipient , amount });
    };
    static calculateBalance({ chain, address }) {
        let outputsTotal = 0;

        // through all block of the blockchain
        for(let i=1; i<chain.length; i++) {
            const block = chain[i]
            
            // through all transaction of the block.data
            for(let transaction of block.data) {
                // if equal to the given adress get the output for the transaction
                const addressOutput = transaction.outputMap[address];

                // if so
                if(addressOutput) {
                    // add the amount to the outputsTotal
                    outputsTotal = outputsTotal + addressOutput
                }
            }
        }

        return STARTING_BALANCE + outputsTotal;
    };
};
module.exports = Wallet;