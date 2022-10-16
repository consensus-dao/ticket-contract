async function main() {
    const Ticket = await ethers.getContractFactory("Ticket")
    const ticket = await Ticket.deploy("0x78000b0605E81ea9df54b33f72ebC61B5F5c8077", "0x78000b0605E81ea9df54b33f72ebC61B5F5c8077", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1")
    console.log("Ticket Contract deployed to address:", ticket.address)
  
    const InPersonTicketNFT = await ethers.getContractFactory("InPersonTicketNFT")
    const contract = await InPersonTicketNFT.deploy()
    console.log("InPersonTicketNFT Contract deployed to address:", contract.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  