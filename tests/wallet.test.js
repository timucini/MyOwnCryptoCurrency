const Wallet = require('../currency/wallet/index')
const { verifySignature} = require('../crypto')

describe('wallet', () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it('has `balance`', () => {
        // check if a wallet has a balance
        expect(wallet).toHaveProperty('balance');
    });

    it('has `public key`', () => {
        // wallet needs to have a public key
        expect(wallet).toHaveProperty('publicKey');
    });

    describe('sign data', () => {
        const data= 'testData';
        // a wallet should verify a signature for transactions
        it('verifies a signature', () => {
            expect(
                // with valid publickey,data and signature should be verified
            verifySignature({
                publicKey: wallet.publicKey,
                data,
                signature: wallet.sign(data)
            })
            ).toBe(true)
        });

        it('does not verify an invalid signature', () => {
            expect(
                // with a signature of another wallet it should not be varified
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data)
                })
            ).toBe(false)
        });
    });
});