const express = require('express');
const app = express();

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