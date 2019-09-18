const crypto = require('crypto');

// any inputs goint to be put in ONE array with ...inputs
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    hash.update(inputs.sort().join(' '));

    return hash.digest('hex');
};

module.exports = cryptoHash;