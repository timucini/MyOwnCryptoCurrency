const Blockchain = require('../blockchain');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'inital'});

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

const times = [];

// test for 10000 Mined blocks
for ( let i=0; i<10000; i++) {
    // timestamp of last  block
    prevTimestamp = blockchain.chain[blockchain.chain.length-1].timestamp;
    // add new block
    blockchain.addBlock({ data: 'block ${i}'});
    // get timestamp of nextblock
    nextBlock = blockchain.chain[blockchain.chain.length-1];
    nextTimestamp = nextBlock.timestamp;
    // compare and push to times-array
    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    // this reduces the times-array to a average sum
    average = times.reduce((total, num) => (total + num))/times.length;

    console.log(`Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`);
}