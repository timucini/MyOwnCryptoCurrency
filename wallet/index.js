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
        return this.keyPair.sign(cryptoHash(data))
    }
};
module.exports = Wallet;