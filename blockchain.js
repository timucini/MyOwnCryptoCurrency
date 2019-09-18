const Block = require('./block');
const cryptoHash = require('./cryptoHash');

class Blockchain {
    constructor() {
        // chain should start with the genesis Block
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        // we can use the mineBlock method in Block
        const newBlock = Block.mineBlock({
            // the lastBlock for the new Block is the last Block in the chain
            lastBlock: this.chain[this.chain.length-1],
            data
        })
        this.chain.push(newBlock);
    }
    static isValidChain(chain) {

        // check if first Block is a genesis Block
        // using JSON-Object to compare both blocks
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        };
        // check other blocks than genesis block
        for (let i=1; i<chain.length; i++) {
            const { timestamp, lastHash, hash, data} = chain[i]

            // get the hast-value from block before
            const actualLastHast = chain[i-1].hash;

            if (lastHash !== actualLastHast) return false;

            /*
                Here we need to use our cryptoHash-function
                -> it uses all the input for the block, that is validated 
                -> generated the SHA-256 out of it
                that will be compared to the Hash-Value in the chain at that block
            */
            const validetedHash = cryptoHash(timestamp, lastHash, data);

            if (hash !== validetedHash) return false;
        }

        return true;
    }
}

module.exports = Blockchain;