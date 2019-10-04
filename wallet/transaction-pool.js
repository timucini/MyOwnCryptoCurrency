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
}

module.exports = TransactionPool