# MyOwnCryptoCurrency
My first CryptoCurrency builded with NodeJs and React
Written By: Timur Burkholz
Contact: timurburk@googlemail.com
Github-Repo: https://github.com/timucini/MyOwnCryptoCurrency

Installation:

1. Install Node.js ( Version > 8.16.0)

2. In Root-Project folder open command line:
	Run "npm install" , which will install all needed npm-packages

3. Install REDIS-Server on your local machine (https://redis.io/download)
	For Windows users open command line in Project-Folder and run: "npm run install-redis-windows" which will install Redis locally
	
Start:
-"npm run start" for normal startup

If that fails: 
-to start a root node run "npm run dev-backend" in command line
-after backend ist loaded run "npm run dev-frontend" in another command line window,which will start the frontend
-Open browser and go to "localhost:3000"


Scripts (run in project root-folder in command line):
"npm run start": normal startup for application
"npm run test": Jest-Testing
"npm run dev": starts backend in dev-mode  
"npm run dev-peer": starts another peer, which will open another node in the blockchain-network 
"npm run build-fronted": Builds frontend, if frontend has been changed, frontend needs to be builded.
"npm run dev-frontend": development frontend 



Project-Structure:
-Api-Folder: Server.js with express-setup
-Block-Folder: Block-Class in block.js
-Blockchain: Blockchain-Class in blockchain.js
-Cryptograhpy: Crytography-Methods 
-Frotend: React-builded frontend
-Redis: Redis for windows 
-Mining: transaction-miner-class
-scripts: test-script for block-mining
-test: test written with Jest
-wallet: Wallet-class

Configuration in config.js
Startup in index.js 
