const Transaction = require('./transaction')
const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require('../cryptography/cryptography');


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
    createTransaction({ recipient, amount, chain }) {
        // if a chain is  passed and defined
        if (chain) {
            // calculate the Balance before every each Transaction if chain is passed
            this.balance = Wallet.calculateBalance({
                chain,
                address: this.publicKey
            });
        }
        
        if ( amount > this.balance) {
            throw new Error('Amount exceeds balance');
        }

        return new Transaction({ senderWallet: this, recipient , amount });
    };
    static calculateBalance({ chain, address }) {
        let hasConductedTransaction = false;
        let outputsTotal = 0;

        // through all block of the blockchain from backwards
        for(let i=chain.length-1 ; i>0; i--) {
            const block = chain[i]
            
            // through all transaction of the block.data
            for(let transaction of block.data) {
                // we check if the given wallet has made an transaction -> balance should always rely on the last transaction from the wallet
                if ( transaction.input.address === address) {
                    hasConductedTransaction = true;
                }


                // if equal to the given adress get the output for the transaction
                const addressOutput = transaction.outputMap[address];

                // if so
                if(addressOutput) {
                    // add the amount to the outputsTotal
                    outputsTotal = outputsTotal + addressOutput
                }
            }
            // so it has made transactions, for-loop should stop, because we look for the latest balance of the wallet
            if(hasConductedTransaction) {
            break;
            }
        }
        return hasConductedTransaction ? outputsTotal:  STARTING_BALANCE + outputsTotal;
    };
};
module.exports = Wallet;