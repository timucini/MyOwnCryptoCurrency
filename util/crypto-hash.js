const crypto = require('crypto');


// any inputs goint to be put in ONE array with ...inputs
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    // we map all the inputs and take their strinfify form ->
    // to prevent inputs pointing to original objects
    hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));

    return hash.digest('hex');
};

module.exports = cryptoHash;