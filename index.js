const express = require('express');
const request = require('request');
const Blockchain = require('./chain/blockchain');
const bodyParser = require('body-parser');
const Pubsub = require('./bin/redisPattern')


const app = express();
const blockchain = new Blockchain();
const pubsub = new Pubsub({ blockchain});

// root-node
const DEFAULT_PORT = 3000;
const ROOT_NODE_ADRESS = `http://localhost:${DEFAULT_PORT}`



app.use(bodyParser.json());

// express function with request(req) and result(res)
app.get('/api/getBlocks', (req, res) => {
    
    // result is the blockchain.chain as a json
    res.json(blockchain.chain);
});

// sync local blockchain on connect using request lib
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADRESS}/api/getBlocks`}, (error, response, body) => {
        
        // if request was successfull
        if (!error & response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            // then replace local chain with the root chain on sync
            console.log('replace chain on sync :', rootChain);
            blockchain.replaceChain(rootChain);
        }
    })
};

// we use that if port 3000 is already in use
let PEER_PORT;
if(process.env.GENERATE_PEER_PORT === 'true') {
    // give it a random port from 1-1000
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() *1000);
}


const PORT = PEER_PORT || DEFAULT_PORT;
// express function with listening at port localhost:Port
app.listen(PORT, () => {
    console.log('started at port:'+PORT)
    // sync Chain on Start

    if (PORT != DEFAULT_PORT) {
        syncChains();
    }
});

app.post('/api/mineBlock', (req,res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    pubsub.broacastChain();

    res.redirect('/api/getBlocks');
});