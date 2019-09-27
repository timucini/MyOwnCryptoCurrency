const { STARTING_BALANCE } = require('../../config');
const { ec, cryptoHash  } = require('../../crypto');


class Wallet {
    constructor() {
        // start-balance for test porpuse
        this.balance =STARTING_BALANCE;

        // using EC-Lib defined in /crypto/index.js
        // function defines us KeyPairs based on cryptographie
        this.keyPair = ec.genKeyPair();

        // we want the publicKey to be encoded in hex-form
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }
    sign(data) {
        return this.keyPair.sign(cryptoHash(data))
    }
};

module.exports = Wallet;