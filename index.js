const express = require('express');
const request = require('request');
const path = require('path')
const Blockchain = require('./blockchain/blockchain');
const bodyParser = require('body-parser');
const PubSub = require('./pubsub/redisPattern');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet/wallet');
const app = express();
const isDevelopment = process.env.ENV === 'development';
const REDIS_URL = isDevelopment ? 'redis://127.0.0.1:6379' : 'redis://h:pa427241f95c8f6ac9722fc24f51b5ab59976a57e7ba20f4e8a0e835c6adce5f9@ec2-3-230-5-223.compute-1.amazonaws.com:6739'
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const TransactionMiner = require(`./mining/transaction-miner`);
const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub});
const DEFAULT_PORT = 3000;
// root node_adress is where the default port is started
const ROOT_NODE_ADRESS= `http://localhost:${DEFAULT_PORT}`;



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend/dist')));

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

app.post('/api/generateTransaction',(req, res) => {
    const { amount, recipient } = req.body;

    // check if Wallet already has an transaction in the existing transaction pool
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey });

    try {
        if (transaction) {
            // if a transaction from this wallet is already in existing transaction pool
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            // if no transaction from the wallet is in the existing transaction pool
            // to create a new transaction through the api
            // by passing the Chain the Balance should be updated everytime we create a Transaction
            transaction = wallet.createTransaction({
                recipient,
                amount,
                chain: blockchain.chain 
            });
        }
    } catch(error) {
        // for invalid transaction return a invalid status code
        return res.status(400).json({ type: 'error', message: error.message });
    }

    // add transaction to the transactionPool
    transactionPool.setTransaction(transaction);

    // handle transaction updates
    // local transaction pool gets updates with new transaction-pool -data
    pubsub.broadcastTransaction(transaction);


    // response from api
    res.json({ type: 'success', transaction });
});


app.get('/api/getTransaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();

    res.redirect('/api/getBlocks');
});

app.get('/api/getWallet', (req,res) => {
    const address = wallet.publicKey

    res.json({
        address,
        balance: Wallet.calculateBalance({
            chain: blockchain.chain,
            address
        })
    });
});

app.get('/api/getLength', (req,res) => {
    res.json(blockchain.chain.length);
});

app.get('/api/getBlocks/:id', (req, res) => {
    const { id } = req.params;

    const { length } = blockchain.chain;
    // with slice() we can copy the blockchain and reverse the copy
    const blocksReversed = blockchain.chain.slice().reverse();

    let startIndex = (id-1) * 5;
    let endIndex = id * 5;

    startIndex = startIndex < length ? startIndex : length;
    endIndex = endIndex < length ? endIndex : length;

    res.json(blocksReversed.slice(startIndex, endIndex));
});

app.get('/api/getAddresses', (req, res) => {
    const addressMap = {}

    for (let block of blockchain.chain) {
        for (let transaction of block.data) {
            const recipient = Object.keys(transaction.outputMap);
            // return all recipient in the transction output for all transactions
            // get all known recipients/address in the chain
            recipient.forEach(recipient => addressMap[recipient] = recipient);
        }
    }
    console.log(addressMap)
    res.json(Object.keys(addressMap));
});

app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'))
});
// sync local Chain with the root_node Chain
const syncWithRoot = () => {
    request({ url: `${ROOT_NODE_ADRESS}/api/getBlocks` }, (error, response, body) => {
        if(!error && response.statusCode === 200 ) {
            const rootChain = JSON.parse(body);

            console.log('replace chain on sync with:', rootChain);
            // we can try to replace local chain with the rootchain
            blockchain.replaceChain(rootChain);
        }
    });
    // sync local transaction-pool-map with root map on connect
    request({ url: `${ROOT_NODE_ADRESS}/api/getTransaction-pool-map`}, (error, response, body) => {
        if(!error && response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace the transaction pool map on a sync with', rootTransactionPoolMap)

            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};

if(isDevelopment) {
    const walletFoo = new Wallet();
    const walletBar = new Wallet();

    const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
    };

    const walletAction = () => generateWalletTransaction({
    wallet, recipient: walletFoo.publicKey, amount: 5
    });

    const walletFooAction = () => generateWalletTransaction({
    wallet: walletFoo, recipient: walletBar.publicKey, amount: 10
    });

    const walletBarAction = () => generateWalletTransaction({
    wallet: walletBar, recipient: wallet.publicKey, amount: 15
    });

    for (let i=0; i<20; i++) {
    if (i%3 === 0) {
        walletAction();
        walletFooAction();
    } else if (i%3 === 1) {
        walletAction();
        walletBarAction();
    } else {
        walletFooAction();
        walletBarAction();
    }

    transactionMiner.mineTransactions();
    }
}


// if default port is blocked
let PEER_PORT;

// when a peers connect locally we take another port
if (process.env.GENERATE_PEER_PORT === 'true') {
    // peerport ist default port +-random 1000
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
// express function with listening at port localhost:Port
app.listen(PORT, () => {
    console.log('started at port:'+PORT);
    
    // only if not the root_node otherwise it would try to sync rootchain with rootchain
    if ( PORT !== DEFAULT_PORT) {
    // sync Chains on startup
    syncWithRoot();
    }
});

