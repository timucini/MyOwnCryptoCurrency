const { GENESIS_BLOCK } = require('./config')

class Block {
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    //first block= genesis_block from config.js
    static genesis() {
        return new this(GENESIS_BLOCK);
    }
    static mineBlock({ lastBlock, data}) {
        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data
        })
    }
} 

module.exports = Block;

