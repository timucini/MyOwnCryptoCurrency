const Blockchain = require('./blockchain');
const Block = require('./block');
const cryptoHash = require('./cryptoHash')

describe('Blockchain', () => {
    // let becaue it needs to be variabel
    let blockchain, newChain, originalChain;

    // before every test we need to initialize a NEW blockchain
    beforeEach(() => {
        blockchain = new Blockchain();
        newChain = new Blockchain();
        originalChain = blockchain.chain;
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

            describe('and the chain contains a block with a jumped difficulty', () => {
                it('returns false', () =>{
                    const lastBlock = blockchain.chain[blockchain.chain.length-1];
                    const lastHash = lastBlock.hash;
                    const timestamp =Date.now();
                    const nonce = 0;
                    const data= [];
                    // difficulty that jumps more than 1 in comparison to the lastblock, which should be forbidden
                    const difficulty = lastBlock.difficulty -2;

                    const hash = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

                    // define a block with a jumped difficulty
                    const invalidBlock = new Block({ timestamp, lastHash, hash, nonce, difficulty, data });
                    
                    // push a block with an jumped difficulty
                    blockchain.chain.push(invalidBlock);

                    // that should result in an invalid blockchain
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

    // when the original Chain should be replaced by a new one -> Chain Replacement
    describe('replaceChain()', () => {
        let errorMock, logMock;

        beforeEach(() => {
            // tempory functions for tests
            errorMock = jest.fn();
            logMock = jest.fn();

            // 
            global.console.error = errorMock;
            global.console.log = logMock;
        })

        // the new chain needs to be longer than the original chain
        describe('when the new chain is not longer', () => {
            beforeEach(() => {
                 // configure the new chain, so we can compare the original with the newChain,
                // with that it differs to the original chain
                newChain.chain[0] = { new: 'chain'}

                //try to replace the Chain with the new chain
                blockchain.replaceChain(newChain.chain); 
            })

            it('does not replace the chain', () => {
                //because the new chain isnt longer, it should not replace the original chain
                expect(blockchain.chain).toEqual(originalChain);
            });
            it('logs an error', () => {
                expect(errorMock).toHaveBeenCalled();
            })
        });


        describe('when the chain is longer', () => {
            beforeEach(() => {
                // add this blocks this to the newChain at each test
                newChain.addBlock({ data: 'Timur' });
                newChain.addBlock({ data: 'HWR' });
                newChain.addBlock({ data: 'Bachelor' });
            });
            describe('and the chain is invalid', () => {
                it('does not replace the chain', () => {
                    newChain.chain[2].hash = 'not valid hash'
                    //tryp to replace Chain with the manipulated Chain
                    blockchain.replaceChain(newChain.chain)
                    //that should not be allowed, so the newChain is still the original chain
                    expect(blockchain.chain).toEqual(originalChain)
                });
            });
            describe('and the chain is valid', () => {
                beforeEach(() => {
                    // try to replace chain with new chain
                    blockchain.replaceChain(newChain.chain)
                });
                it('does replace the chain', () => {
                    // now its replaced the chain
                    expect(blockchain.chain).toEqual(newChain.chain)
                });
                it('logs true chain replacement', () => {
                    expect(logMock).toHaveBeenCalled();
                });
            });
        });
    });
});
