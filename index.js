const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./app/redisPattern');


const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
// root node_adress is where the default port is started
const ROOT_NODE_ADRESS= `http://localhost:${DEFAULT_PORT}`;



app.use(bodyParser.json());

// express function with request(req) and result(res)
app.get('/api/getBlocks', (req, res) => {
    
    // result is the blockchain.chain as a json
    res.json(blockchain.chain);
});
app.post('/api/mineBlock', (req,res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });
    
    // after a block is mined we broadcast the chain
    pubsub.broadcastChain();
    res.redirect('/api/getBlocks');
});

// sync local Chain with the root_node Chain
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADRESS}/api/getBlocks` }, (error, response, body) => {
        if(!error && response.statusCode === 200 ) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on sync with:', rootChain);
            // we can try to replace local chain with the rootchain
            blockchain.replaceChain(rootChain);
        }
    });
};

// if default port is blocked
let PEER_PORT;

// when a peers connect locally we take another port
if (process.env.GENERATE_PEER_PORT === 'true') {
    // peerport ist default port +-random 1000
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
// express function with listening at port localhost:Port
app.listen(PORT, () => {
    console.log('started at port:'+PORT);
    
    // only if not the root_node otherwise it would try to sync rootchain with rootchain
    if ( PORT !== DEFAULT_PORT) {
    // sync Chains on startup
    syncChains();
    }
});

