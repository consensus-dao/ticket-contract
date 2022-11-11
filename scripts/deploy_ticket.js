async function main() {
  // remember to update addresses of ohm, frax, dai and usdc!
  const Ticket = await ethers.getContractFactory("Ticket");
  const ticket = await Ticket.deploy("0xFBEb8FCcaDB61D4219864E80F95dc9E7DC0a1596", "0x0000000000000000000000000000000000000000", "0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1", "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1");
  ticket.deployed();
  console.log("Ticket Contract deployed to address:", ticket.address);

  const InPersonTicketNFT = await ethers.getContractFactory("InPersonTicketNFT");
  const inPersonTicketNFT = await InPersonTicketNFT.deploy(ticket.address);
  console.log("InPersonTicketNFT Contract deployed to address:", inPersonTicketNFT.address);
  inPersonTicketNFT.deployed();
  // there's only 40 seats in AppWorks!
  await inPersonTicketNFT.setTicketInventories(40);
  // set NFT addr
  await ticket.setInPersonTicketNFTAddr(inPersonTicketNFT.address);
  // set ticket price
  await ticket.setTicketPrice("2022-in-person", true, ethers.utils.parseUnits("40", 18));
  await ticket.setTicketPrice("2022-in-person-contributor", true, ethers.utils.parseUnits("20", 18));
  await ticket.setTicketPrice("2022-in-person", false, ethers.utils.parseUnits("0.006", 18));
  await ticket.setTicketPrice("2022-in-person-contributor", false, ethers.utils.parseUnits("0.003", 18));
  console.log('Finished!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
