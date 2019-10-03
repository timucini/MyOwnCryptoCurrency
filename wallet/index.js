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
};
module.exports = Wallet;