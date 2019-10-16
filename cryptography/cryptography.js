const EC = require('elliptic').ec;
const cryptoHash = require('./crypto-hash');

// same a bitcoin
const ec = new EC('secp256k1');

  // decrypto given data and check it with proposed data
const verifySignature = ({ publicKey, data, signature }) => {
    // key in hex-form
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');
    // verify the data with a given signature, to check if signature is valid
    return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature, cryptoHash };