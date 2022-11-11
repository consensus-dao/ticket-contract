require('dotenv').config();
const ethers = require('ethers');
const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethersProvider);
const contract = '0xEe8C4781139286c248B9E81C8ca5C850d6c2c9A7'
const ticketContract = new ethers.Contract(contract, require('../artifacts/contracts/Ticket.sol/Ticket.json').abi, signer);

(async function main() {
    console.log(await ticketContract.withdrawToken());
})();

