module.exports = {
    generate: function({walletOne,walletTwo,blockchain,transactionPool,transactionMiner, wallet}) {
        const generateWalletTransaction = ({ wallet, recipient, amount }) => {
        const transaction = wallet.createTransaction({
        recipient, amount, chain: blockchain.chain
        });

        transactionPool.setTransaction(transaction);
        };

        const testOne = () => generateWalletTransaction({
        wallet, recipient: walletOne.publicKey, amount: 25
        });

        const testTwo = () => generateWalletTransaction({
        wallet: walletOne, recipient: walletTwo.publicKey, amount: 15
        });

        const testThree = () => generateWalletTransaction({
        wallet: walletTwo, recipient: wallet.publicKey, amount: 15
        });


        // random transactions, so we have some mined blocks to start with
        for (let i=0; i<15; i++) {
        if (i%3 === 0) {
            testOne();
            testTwo();
        } else if (i%3 === 1) {
            testOne();
            testThree();
        } else {
            testTwo();
            testThree();
        }

        transactionMiner.mineTransactions();
        }
    }
}