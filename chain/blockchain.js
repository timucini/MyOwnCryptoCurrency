const Block = require('./block');
const { cryptoHash } = require('../crypto');

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

    replaceChain(chain) {
        // dont replace current chain instance with new (shorter) one
        if (chain.length <= this.chain.length) {
            console.error('Incoming chain is shorter than the current one')
            return;
        }
        // if the new longer chain is invalid, also dont replace the current chain instance
        if (!Blockchain.isValidChain(chain)) {
            console.error('Incoming chain is NOT valid')
            return;
        }
        // else replace the current chain with the new one
        console.log('replacing chain with: ', chain)
        this.chain = chain;
    }

    static isValidChain(chain) {

        // check if first Block is a genesis Block
        // using JSON-Object to compare both blocks
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        };
        // check other blocks than genesis block
        for (let i=1; i<chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data} = chain[i]

            // get the hast-value from block before
            const actualLastHast = chain[i-1].hash;
            const lastDifficulty = chain[i-1].difficulty;




            if (lastHash !== actualLastHast) return false;

            /*
                Here we need to use our cryptoHash-function
                -> it uses all the input for the block, that is validated 
                -> generated the SHA-256 out of it
                that will be compared to the Hash-Value in the chain at that block
            */
            const validetedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            // only when all block have a valid cHash
            if (hash !== validetedHash) return false;

            // only a diffulty jump of 1 is allowed, positiv and negativ
            if (Math.abs(lastDifficulty - difficulty) > 1) return false; 
        }

        return true;
    }
}

module.exports = Blockchain;