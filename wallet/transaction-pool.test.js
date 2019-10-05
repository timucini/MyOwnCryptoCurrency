const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain')

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'some-recipient',
            amount: 50
        });
    });

    describe('setTransaction()', () => {
        it('adds a transaction', () => {
            transactionPool.setTransaction(transaction);

            // if transaction is added to the pool we look after the unique transaction id
            expect(transactionPool.transactionMap[transaction.id])
                .toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input andress', () => {
            transactionPool.setTransaction(transaction);
            expect(
                transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey})
            ).toBe(transaction);
        });
    });

    describe('validTransactions()', () => {
        let validTransactions, errorMock;
        

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn(),
            global.console.error = errorMock;

            // test with 10 Transaction within the transaction pool
            for (let i=0; i<10 ; i++) {
                transaction = new Transaction ({
                    senderWallet,
                    recipient: 'some-recipient',
                    amount: 30
                });
                // sollte man ändern
                if(i%3===0) {
                    // manipulate the amount -> invalid amount
                    transaction.input.amount = 999999;
                }
                else if(i%3===1) {
                    // manipulte the signature -> invalid signature
                    transaction.input.signature = new Wallet().sign('something')
                }
                else {
                    // valid transactions
                    validTransactions.push(transaction)
                }

                transactionPool.setTransaction(transaction);
            }
        });
        it('returns valid transaction', () => {
           expect(transactionPool.validTransactions()).toEqual(validTransactions);
        })
        it('logs errors for the invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        })
    });

    describe('clear()', () => {
        it('clears the transactions', () => {
            transactionPool.clear();

            expect(transactionPool.transactionMap).toEqual({});
        })
    });

    describe('clearBlockchainTransactions()', () => {
        // only clear the transaction that get added in a mined block on a specific blockchain
        it('clears the pool of any existing blockchain transaction', () => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};

            for (let i=0; i<6; i++) {
                const transaction = new Wallet().createTransaction({
                    recipient: 'someone', amount :20
                });

                transactionPool.setTransaction(transaction);

                if(i%2===0) {
                    blockchain.addBlock({ data : [transaction]})
                } else {
                    // if not it should remain in the transaction pool
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }
            transactionPool.clearBlockchainTransactions({ chain: blockchain.chain});
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    })
});