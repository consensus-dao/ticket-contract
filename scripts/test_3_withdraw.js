require('dotenv').config();
const ethers = require('ethers');
const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethersProvider);
const contract = '0x34e2C75a4C106C74F1b8bbCAA7A525e5ECE063EC'
const ticketContract = new ethers.Contract(contract, require('../artifacts/contracts/Ticket.sol/Ticket.json').abi, signer);

(async function main() {
    console.log(await ticketContract.withdrawToken());
})();

