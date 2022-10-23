async function main() {
  // remember to update addresses of ohm, frax, dai and usdc!
  const Ticket = await ethers.getContractFactory("Ticket");
  const ticket = await Ticket.deploy("0x78000b0605E81ea9df54b33f72ebC61B5F5c8077", "0x0000000000000000000000000000000000000000", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", "0x29dc652920a8Ee9025C2cEdf6Ad95b5541F52bA1", "0x9B4AD313860F7E4c0Fd64944432e15E96d9Db771", "0x88A376263a5E84B26Cb2de7877FBA4F28c5D9107")
  ticket.deployed();
  console.log("Ticket Contract deployed to address:", ticket.address)

  const InPersonTicketNFT = await ethers.getContractFactory("InPersonTicketNFT")
  const inPersonTicketNFT = await InPersonTicketNFT.deploy(ticket.address)
  console.log("InPersonTicketNFT Contract deployed to address:", inPersonTicketNFT.address)
  inPersonTicketNFT.deployed();
  // set NFT addr
  await ticket.setInPersonTicketNFTAddr(inPersonTicketNFT.address);
  // set ticket price
  await ticket.setTicketPrice("2022-in-person", true, 1);
  await ticket.setTicketPrice("2022-in-person", false, 1);
  console.log('Finished!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
