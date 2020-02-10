const Block = require('../block/block');
const Transaction = require('../wallet/transaction');
const Walllet = require('../wallet/wallet');
const { cryptoHash } = require('../cryptography/cryptography');
const { MINING_REWARD } = require('../config');

class Blockchain {
    constructor() {
        // chain should start with the genesis Block
        this.chain = [Block.genesis()];
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

    addBlock({ data }) {
        // we can use the mineBlock method in Block
        const newBlock = Block.mineBlock({
            // the lastBlock for the new Block is the last Block in the chain
            lastBlock: this.chain[this.chain.length-1],
            data
        })
        this.chain.push(newBlock);
    }
    // the incoming validateTransaction is set by the pubsub-class
    replaceChain(chain, validateTransaction ,onSuccess) {
        // don't replace current chain instance with new (shorter) one
        if (chain.length <= this.chain.length) {
            console.error('Incoming chain is shorter than the current one')
            return;
        }
        // if the new longer chain is invalid, also don't replace the current chain instance
        if (!Blockchain.isValidChain(chain)) {
            console.error('Incoming chain is NOT valid')
            return;
        }

        // only if the valideTransaction-Flag is set
        // prevent replacing a chain, if there is manipulated transaction-data
        if (validateTransaction && !this.validTransactionData({ chain})) {
            console.error('Incoming chain has invalid data');
            return;
        }

        // only if onSuccess is passed from pubsub-implementation
        if (onSuccess) onSuccess();
        // else replace the current chain with the new one
        console.log('replacing chain with: ', chain)
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        const rewardInput = { address: 'Mining_address' };
        // iterate through blockchain
        for(let i=1; i<chain.length; i++) {
            const block = chain[i];
            // outside of the for-loop so we can check every transaction in every block
            const transactionSet = new Set();
            let rewardTransactionCount = 0;
            // iterate through all transaction within a block
            for (let transaction of block.data) {

                // check for the Miner Transaction
                if (transaction.input.address === rewardInput.address) {
                    rewardTransactionCount +=1;
                     // check for multiple  MinerRewards
                    if( rewardTransactionCount > 1) {
                        console.error('Miner rewards exceeds limit');
                        return false;
                    }
                    // access all the values of the outputMap of a transaction
                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount is invalid');
                        return false;
                    }
                } else {
                    // not the reward transaction
                    if(!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction');
                        return false;
                    }
                    // check if the input Wallet Balance is based on the history of the blockchain
                    const trueBalance = Walllet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    })
                    // check the history based Balance with the input balance
                    if(transaction.input.amount !== trueBalance) {
                        console.error('Invalid input amount');
                        return false;
                    }
                    if (transactionSet.has(transaction)) {
                        console.error('An identical transaction appears more than once in the block')
                        return false;
                    } else {
                        transactionSet.add(transaction)
                    };
                }
            }
        }
        return true;
    }
}

module.exports = Blockchain;