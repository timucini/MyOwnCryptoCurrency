// time in milisecs
const MINE_RATE= 1000;

// init diff for genesis data
const INITIAL_DIFFICULTY = 3;


//hard-coded global Values
const GENESIS_BLOCK = {
    timestamp: 1,
    lastHash: '-----',
    hash: 'hash-one',
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: []
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: '*authorzied-reward*' };

const MINING_REWARD = 50;

module.exports = { 
    GENESIS_BLOCK,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};