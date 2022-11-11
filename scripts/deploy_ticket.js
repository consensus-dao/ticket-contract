async function main() {
  // remember to update addresses of ohm, frax, dai and usdc!
  const Ticket = await ethers.getContractFactory("Ticket");
  const ticket = await Ticket.deploy("0x78000b0605E81ea9df54b33f72ebC61B5F5c8077", "0x0000000000000000000000000000000000000000", "0xD635a0d726B9bd390eE9684eb758Db0bb2938E05", "0xD635a0d726B9bd390eE9684eb758Db0bb2938E05", "0xD635a0d726B9bd390eE9684eb758Db0bb2938E05");
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
  await ticket.setTicketPrice("2022-in-person-contributor", false, ethers.utils.parseUnits("0.003", 18));
  console.log('Finished!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
