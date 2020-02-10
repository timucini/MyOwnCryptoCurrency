const crypto = require('crypto');


// any inputs going in one array with ...inputs
const cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256');

    /* map all the inputs and take their stringify form ->
     to prevent inputs pointing to original objects
    */
     hash.update(inputs.map(input => JSON.stringify(input)).sort().join(' '));

    return hash.digest('hex');
};

module.exports = cryptoHash