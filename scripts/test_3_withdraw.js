require('dotenv').config();
const ethers = require('ethers');
const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethersProvider);
const contract = '0x8Bc6605fF431157CFFb2922dEe73b43553dA93a4'
const ticketContract = new ethers.Contract(contract, require('../artifacts/contracts/Ticket.sol/Ticket.json').abi, signer);

(async function main() {
    console.log(await ticketContract.withdrawToken());
})();

