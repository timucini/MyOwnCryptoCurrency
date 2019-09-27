const express = require('express');
const Blockchain = require('./blockchain');
const bodyParser = require('body-parser');


const app = express();
const blockchain = new Blockchain();


app.use(bodyParser.json());

// express function with request(req) and result(res)
app.get('/api/getBlocks', (req, res) => {
    
    // result is the blockchain.chain as a json
    res.json(blockchain.chain);
});
const PORT = 3000
// express function with listening at port localhost:Port
app.listen(PORT, () => console.log('started at port:'+PORT));

app.post('/api/mineBlock', (req,res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/getBlocks');
});