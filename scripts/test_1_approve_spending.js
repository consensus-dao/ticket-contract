require('dotenv').config();
const ethers = require('ethers');
const ethersProvider = new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/1cfc0527ead8453fa7028db9134dd28a')
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethersProvider);
const ticketContract = new ethers.Contract('0x02BF9031c93DE680e83aB66Ae6F38efFcB79719b', require('../artifacts/contracts/Ticket.sol/Ticket.json').abi, signer);
// const daiContract = new ethers.Contract('0x88A376263a5E84B26Cb2de7877FBA4F28c5D9107', require('../IERC20.json').abi, signer);

(async function main() {
    console.log(`inPersonTicket ticket price: $${parseInt(await ticketContract.usdTicketPrices("2022-in-person"))}`);
    await ticketContract.setTicketPrice("2022-in-person", true, 4);
    await ticketContract.setTicketPrice("2022-in-person-contributor", true, 2);
    await ticketContract.setTicketPrice("2022-in-person", false, 2);
    await ticketContract.setTicketPrice("2022-in-person-contributor", false, 1);
    // console.log(await daiContract.approve(process.env.PUBLIC_KEY, 100));
})();

