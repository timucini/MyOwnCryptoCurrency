const Block = require('./block'); 
const { GENESIS_BLOCK } = require('./config');
const cryptoHash = require('./cryptoHash');

describe('Block', () => {
    const timestamp = 'example-date';
    const lastHash = 'example-lastHash';
    const hash = 'abc-hash';
    const data = ['blockchain', 'data'];
    const block = new Block({ timestamp, lastHash, hash, data});


    //test if a block has valid values
    it('Block has valid Data', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
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
                .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));
        });
    });
});

