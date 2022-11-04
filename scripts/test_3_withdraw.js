require('dotenv').config();
const ethers = require('ethers');
const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethersProvider);
const contract = '0xF009c625ce71F61D98f94C635B839130a8EE0f79'
const ticketContract = new ethers.Contract(contract, require('../artifacts/contracts/Ticket.sol/Ticket.json').abi, signer);

(async function main() {
    console.log(await ticketContract.withdrawToken());
})();

