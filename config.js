
//first block (genesis Block)
const GENESIS_BLOCK = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'Genesis_Block',
    difficulty: 4,
    nonce: 0,
    data: []
};
// time in milisecs
const MINE_RATE= 1000;
const STARTING_BALANCE = 2500;
const REWARD_INPUT = { address: '*authorzied-reward*' };
const MINING_REWARD = 25;

module.exports = { 
    GENESIS_BLOCK,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};
