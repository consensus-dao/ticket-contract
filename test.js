require('dotenv').config();
const ethers = require('ethers');
const ethersProvider = new ethers.providers.JsonRpcProvider('https://opt-goerli.g.alchemy.com/v2/9TWpT42dQ5U9KsjrptwNQ2g7pbQBSpQq')
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethersProvider);
const ticketContract = new ethers.Contract('0x0FBc7D5aAd6643e17967E70F6e019798A7bABa3A', require('./artifacts/contracts/Ticket.sol/Ticket.json').abi, signer);

(async function main() {
    const a = await ticketContract.ohm();
    console.log(a)
    console.log(`inPersonTicket ticket price: $${parseInt(await ticketContract.usdTicketPrices("inPersonTicket"))}`)
    // console.log(await ticketContract.setTicketPrice("inPersonTicket", true, 1))
    console.log(await ticketContract.buyTicket("frax", "inPersonTicket", true))
})();

