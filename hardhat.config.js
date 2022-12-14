/**
* @type import('hardhat/config').HardhatUserConfig
*/
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require('solidity-coverage');
const { API_URL, PRIVATE_KEY } = process.env;
module.exports = {
   solidity: "0.8.17",
   defaultNetwork: "hardhat",
   networks: {
      localhost: {
         url: "http://127.0.0.1:8545"
       },
      hardhat: {},
      goerli: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
}