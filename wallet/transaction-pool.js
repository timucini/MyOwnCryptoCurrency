const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        this.transactionMap[transaction.id] = transaction;
    }
    // set the local transactionmap to the incoming one (root)
    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    // check if a transaction from a inputAddress = wallet is already in the transactionPool
    existingTransaction({ inputAddress }) {
        const transactions = Object.values(this.transactionMap);

        return transactions.find(transaction => transaction.input.address === inputAddress);
    }

    validTransactions() {
        // filter all the transactions from the transactionpool, for that we use the transaction validTransaction-method
         return Object.values(this.transactionMap).filter(
            transaction => Transaction.validTransaction(transaction)
            );
    }

    clear() {
        this.transactionMap= {};
    }

    clearBlockchainTransactions({ chain }) {
        // skip genesis block, iterate to every block
        for (let i=1; i<chain.length; i++) {
            const block= chain[i]
            // go through every transaction of the blocks data
            for(let transaction of block.data) {
                // if the transactionmap have the transaction id
                if(this.transactionMap[transaction.id]) {
                    // delete the reference
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}

module.exports = TransactionPool