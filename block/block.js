// to improve hash-algorithm its better to use the binary form, so we can adjust the difficulty more granular  
const hexToBinary = require('hex-to-binary');
const { cryptoHash } = require('../cryptography/cryptography');


class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    //first block= Genesis Block
    static genesis() {
        const genesisBlock = {
            timestamp: 1,
            lastHash: '-----',
            hash: 'Genesis_Block',
            difficulty: 4,
            nonce: 0,
            data: []
        };
        return new this(genesisBlock);
    }
    // the new Block 
    static mineBlock({ lastBlock, data}) {
        let hash, timestamp;
        //const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        // new difficulty of a block should be based on the lastblock
        
        
        // this is when there is fixed diffuculty
        //const { difficulty } = lastBlock;
        
        let { difficulty } = lastBlock;
        
        let nonce = 0;

        // try to mine a block that fits all criterias with it difficulty
        do {
            nonce++;
            // timestamp should be when it fitted the criteria
            timestamp = Date.now();

            // now the diffulty is adjust be our adjust Method
            difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });

            // hash results of all these values
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } // difficulty condition, so its harder to Attack the Blockchain, due to PoW
        while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));
        // result is a valid Hash for a new Block


        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash
        })
    }
    static adjustDifficulty({ originalBlock, timestamp}) {
        // time in milisecs
        const mineRate= 1000;
        // use the difficulty of the last block
        const { difficulty } = originalBlock;
        // compare the difficulty of a last block with the timestamp of a new generated block 
        const difference = timestamp - originalBlock.timestamp;
        // adjust the difficulty

        if (difficulty < 1) return 1;

        if (difference > mineRate ) return difficulty - 1;
        return difficulty + 1;
    }
} 

module.exports = Block;

