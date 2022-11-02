require('dotenv').config();
const ethers = require('ethers');
const ethersProvider = new ethers.providers.JsonRpcProvider(process.env.API_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, ethersProvider);
const contract = '0x8Bc6605fF431157CFFb2922dEe73b43553dA93a4'
const ticketContract = new ethers.Contract(contract, require('../artifacts/contracts/Ticket.sol/Ticket.json').abi, signer);
const daiContract = new ethers.Contract('0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', require('../IERC20.json').abi, signer);

(async function main() {
    console.log(`inPersonTicket ticket price: $${parseInt(await ticketContract.usdTicketPrices("2022-in-person"))}`);
    // await ticketContract.setTicketPrice("2022-in-person", true, 4);
    // await ticketContract.setTicketPrice("2022-in-person-contributor", true, 2);
    // await ticketContract.setTicketPrice("2022-in-person", false, 2);
    // await ticketContract.setTicketPrice("2022-in-person-contributor", false, 1);
    console.log(await daiContract.approve(contract, ethers.utils.parseUnits("10", 18)));
    console.log((await daiContract.allowance(process.env.PUBLIC_KEY, contract)).toString());
})();

