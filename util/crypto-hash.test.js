const cryptoHash = require('./crypto-hash');


describe('cryptoHash()', () => {

    // test if function can crypt to SHA-256 Hash
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('Timur'))
            .toEqual('f8c09f97c8a50ca849aec63dc3b48499958e8c88a8505365d94ff425216edcb6');
    });
    // test is input order is irrelevant, which is needed
    it('produces the same hash with same inputs arguments', () => {
        expect(cryptoHash('one', 'two', 'three'))
            .toEqual(cryptoHash('three','one','two'));
    });

    it('produces a unique hash when the properties have changed on an input', () => {
        const foo = {};
        const originalHash = cryptoHash(foo);
        foo['a'] = 'a';
        // do prevent the cryptoHash function to point to the original Objekt, that have been changed
        // should output a different hash than the changed objekt
        expect(cryptoHash(foo)).not.toEqual(originalHash);
    })
});