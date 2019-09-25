const hexToBinary = require('hex-to-binary');
const Block = require('./block'); 
const { GENESIS_BLOCK, MINE_RATE } = require('./config');
const cryptoHash = require('./cryptoHash');

describe('Block', () => {
    const timestamp = 2000;
    const lastHash = 'example-lastHash';
    const hash = 'abc-hash';
    const data = ['blockchain', 'data'];
    const nonce = 1;
    const difficulty = 1;
    const block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });




    //test if a block has valid values
    it('Block has valid Data', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });


    describe('genesis()', () => {
        const genesisBlock = Block.genesis();
        
        // test if the genesisBlock is a instance of a block 
        it('returns genesis block instance', () => {
            expect(genesisBlock instanceof Block).toBe(true);
        });
        // test if genesis block return the genesis data from config.js
        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_BLOCK);
        })
    })
    describe('mineBlock()', () => {
        const lastBlock = Block.genesis();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({ lastBlock, data});

        // test if a mined Block is returned
        it('returns a Block instance', () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        // the lastHash of a new mined Block needs to be equal to the hash of the lastBlock
        it('sets the `lastHash` to be `hash` of the lastBlock', () => {
          expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });
        // the data for the new mined Block should have the expected data
        it('sets the `data`', () => {
            expect(minedBlock.data).toEqual(data);
        });
        // new mined Block needs a timestamp
        it('sets the `timestamp`', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined); 
        });
        // new mined Block need a valid sha256 hash with given inputs
        it('created a valid SHA-256 `hash` for new block', () => {
            expect(minedBlock.hash)
                .toEqual(
                    cryptoHash(
                        minedBlock.timestamp,
                        minedBlock.nonce,
                        minedBlock.difficulty,
                        lastBlock.hash,
                        data
                    )
                );
        });
        it('sets a `hash` that matches the difficulty criteria', () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty))
                .toEqual('0'.repeat(minedBlock.difficulty));
        });
        it('adjusts the difficulty', () => {
            const possibleResult = [lastBlock.difficulty+1, lastBlock.difficulty-1];
            // the difficulty of a new block should be either the difficulty of the last block -1 or +1
            expect(possibleResult.includes(minedBlock.difficulty)).toBe(true);
        });
    });
    describe('adjustDifficulty()', () => {
        it('should raise difficulty for a new mined block', () => {
           expect(Block.adjustDifficulty({ 
               // mining a new block was shorten than the expected mine rate ( in this test 100 milisecs) 
               // so it the new difficulty for a new mined block should be higher than before
               originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100 })).toEqual(block.difficulty+1); 
        });
        it('should lower difficulty for a new mined block', () =>{
            expect(Block.adjustDifficulty({
                 // mining a new block was longer than the expected mine rate ( in this test 100 milisecs) 
               // so it the new difficulty for a new mined block should be lower than before
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100 })).toEqual(block.difficulty-1);
        });
        it('should have a lower limit of 1', () => {
            block.difficulty = -1;
            // diffulty cant be lower than 1
            expect(Block.adjustDifficulty({ originalBlock: block})).toEqual(1);
        })
    });
});


