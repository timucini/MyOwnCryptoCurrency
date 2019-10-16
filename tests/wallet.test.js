const Wallet = require('../wallet/wallet');
const Transaction = require('../wallet/transaction')
const { verifySignature } = require('../cryptography/cryptography');
const Blockchain = require('../blockchain/blockchain');
const { STARTING_BALANCE } = require('../config');

describe('Wallet', () => {
   let wallet;
   
   beforeEach(() => {
       wallet = new Wallet();
   });

   it('has a `balance`', () => {
       expect(wallet).toHaveProperty('balance');
   });

   it('has a `publicKey`',() => {
       expect(wallet).toHaveProperty('publicKey')
   });

   describe('sign data', () => {
       const data = 'foobar';
         // decrypto given data and check it with proposed data
       it('verifies a signature', () => {
           expect(
            verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })
           ).toBe(true);
       });

       it('does not verify an invalid signature', () => {
        expect(
            // try to sign it with another wallet publickey
            verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: new Wallet().sign(data)
            })
        ).toBe(false);
       });
   });

   describe('createTransaction()', () => {
        describe('and the amount exeeds the balance', () => {
            it(' throws an error', () => {
                expect(() => wallet.createTransaction({ amount: 999996, recipient: 'some-recipient'}))
                    .toThrow('Amount exceeds balance');
            });
        });

        describe('and the amount is valid', () => {
            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 50;
                recipient = 'some-recipient';
                transaction = wallet.createTransaction({ amount, recipient })
            });
            it('create an instance of `Transaction`', () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it('matches the transaction input with the wallet', () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });
            it('outputs the amount to the recipient', () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });

        describe('and a chain is passed', () => {
            it('calls `Wallet.calculateBalance`', () => {
                const calculateBalanceMock = jest.fn();

                // safe the original Balance before the calculate
                const originalCalculateBalance = Wallet.calculateBalance;

                Wallet.calculateBalance = calculateBalanceMock;

                wallet.createTransaction({
                    recipient: 'someone',
                    amount: 10,
                    chain: new Blockchain().chain
                });

                expect(calculateBalanceMock).toHaveBeenCalled();

                // and pass that to the calculate Balance function for the wallet
                Wallet.calculateBalance = originalCalculateBalance;
            });
        });
   });

   describe('calculateBalance()', () => {
        let blockchain;

        beforeEach(() => {
            blockchain= new Blockchain();
        });

        describe('and there are no outputs for the wallet', () => {
            it('returns the `STARTING_BALANCE`', () =>{
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey
                    })
                ).toEqual(STARTING_BALANCE)
            });
        });
        describe('and there are outputs for the wallet', () => {
            let transactionOne, transactionTwo;

            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50
                });

                transactionTwo = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 60
                });

                blockchain.addBlock({ data: [transactionOne, transactionTwo]});

            });
            it('adds the sum of all outputs to the wallet balance', () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey 
                    })
                ).toEqual(
                    STARTING_BALANCE +
                    transactionOne.outputMap[wallet.publicKey] +
                    transactionTwo.outputMap[wallet.publicKey]
                    )
            });

            describe('and the wallet has made a transaction', () => {
                let recentTransaction;

                beforeEach(() =>{
                    recentTransaction = wallet.createTransaction({
                        recipient: 'some-address',
                        amount: 30
                    });

                    blockchain.addBlock({ data: [recentTransaction]});
                });

                it('returns the output amount of the recent transaction', () => {
                    expect(
                        Wallet.calculateBalance({
                            chain: blockchain.chain,
                            address: wallet.publicKey
                        })
                    ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
                });

                describe('and there are outputs next to and after the recent transaction', () => {
                    let sameBlockTransaction, nextBlockTransaction;

                    beforeEach(() => {
                        // create a transaction that is recent
                        recentTransaction = wallet.createTransaction({
                            recipient: 'later-address',
                            amount: 60
                        });
                        // also needs to incluce the Mine-reward
                        sameBlockTransaction = Transaction.rewardTransaction({ minerWallet: wallet});

                        blockchain.addBlock({ data: [recentTransaction, sameBlockTransaction]});

                        // after that its recieving a transaction at a new block
                        // for our wallet
                        // also add this amount should be added
                        nextBlockTransaction = new Wallet().createTransaction({
                            recipient: wallet.publicKey,
                            amount: 75
                        });
                        // a recent transaction 
                        blockchain.addBlock({ data: [nextBlockTransaction]})
                    });
                    it('includes the output amounts in the returned balance', () => {
                        expect(
                            Wallet.calculateBalance({
                                chain: blockchain.chain,
                                address: wallet.publicKey
                            })
                        ).toEqual(
                            recentTransaction.outputMap[wallet.publicKey] +
                            sameBlockTransaction.outputMap[wallet.publicKey] +
                            nextBlockTransaction.outputMap[wallet.publicKey]
                        );
                    });
                });
            });
        });
   });
});