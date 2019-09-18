const Blockchain = require('./blockchain');
const Block = require('./block');

describe('Blockchain', () => {
    // let becaue it needs to be variabel
    let blockchain = new Blockchain();

    // before every test we need to initialize a NEW blockchain
    beforeEach(() => {
        blockchain = new Blockchain();
    })

    // Blockchain needs to be a instance of chain
    it('containg a `chain` Array instance', () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    // First member of blockchain must be the genesis-block
    it('starts with the genesis block', () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    // it should could add a block to the chain
    it('add a new block to the blockchain', () => {
        const newData = 'test data';
        blockchain.addBlock({ data: newData });
        
        // check if the block of the newest Blocks equals the data of the new block after created
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () => {
        describe('when the chain does not start with genesis block', () => {
            it('returns false', () => {
                blockchain.chain[0] = { data: 'not genesis'};

                // needs to be false because chain doesnt start with genesis block
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });
        
        describe('when the chain start with genesis block and has multiple block', () => {
            beforeEach(() => {
                // Blocks for each tests
                blockchain.addBlock({ data: 'Timur' });
                blockchain.addBlock({ data: 'HWR' });
                blockchain.addBlock({ data: 'Bachelor' });
            })
            describe('and a lastHash reference has changed', () => {
                it('returns false', () => {
                    blockchain.chain[2].lastHash = 'broken';

                    // needs to return false because the hast-value of a block has been changed
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                }); 
            });

            describe('and the chain contains a block with an invalid field', () => {
                it('returns false', () => {
            
                    blockchain.chain[2].data = 'corrupt-data';
                
                    // needs to return false because the data is invalid 
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('chain does not contain any invalid blocks', () => {
                it('returns true', () => {

                    // needs to return true, becaue no data has been motified
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });
});
