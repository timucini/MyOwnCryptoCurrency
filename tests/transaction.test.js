const Transaction = require('../currency/wallet/transaction')
const Wallet = require('../currency/wallet/index')
const { verifySignature } = require('../crypto/')

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'recipient-publicKey';
        amount = 120;
        transaction = new Transaction({ senderWallet,recipient,amount})
    });
    // a transaction needs to have an id
    it('transaction has an `id`', () => {
        expect(transaction).toHaveProperty('id');
    });
    
    describe('outputMap', () =>{
        it('has an `outputMap`', () => {
            expect(transaction).toHaveProperty('outputMap');
        });
        it(' outputs the real amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });
        it('outputs remaining belance from senderWaller', () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
        })
    });

    describe('input', () => {
        // transaction needs to have input
        it('has input', () => {
            expect(transaction).toHaveProperty('input');
        });
        // with timestamp
        it('has timestamp in input',() => {
            expect(transaction.input).toHaveProperty('timestamp');
        });
        it('sets the amount to the senderWallet balance', () =>{
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });
        it('sets the adress to the senderWallet public key', () =>{
            expect(transaction.input.adress).toEqual(senderWallet.publicKey);
        });
        it('signs the input', () => {
            expect(
                verifySignature({
                publicKey: senderWallet.publicKey,
                data: transaction.outputMap,
                signature: transaction.input.signature
                })
            ).toBe(true)
        });
    })
});