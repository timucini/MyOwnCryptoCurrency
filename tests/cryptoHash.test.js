const cryptoHash = require('../crypto/cryptoHash');


describe('cryptoHash()', () => {

    // test if function can crypt to SHA-256 Hash
    it('generates a SHA-256 hashed output', () => {
        expect(cryptoHash('Timur'))
            .toEqual('582e0d390f15f45cfc6235f525a53639c04dfef9dd24b0b6252ad292feedcf97');
    });
    // test is input order is irrelevant, which is needed
    it('produces the same hash with same inputs arguments', () => {
        expect(cryptoHash('one', 'two', 'three'))
            .toEqual(cryptoHash('three','one','two'));
    });
});