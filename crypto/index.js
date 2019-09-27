const EC = require('elliptic').ec;
const cryptoHash = require('../crypto/cryptoHash')

// using EC-Lib for Keys, secp256k1 is also used in the bitcoin-technology
// elibtic-based algorithm
const ec = new EC('secp256k1');


// verify a signature
const verifySignature = ({ publicKey, data, signature }) => {
    // using hex-key
    const keyFromPublic = ec.keyFromPublic(publicKey,'hex');

    return keyFromPublic.verify(cryptoHash(data),signature);
};

module.exports = { ec, verifySignature, cryptoHash };