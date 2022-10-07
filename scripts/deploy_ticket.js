async function main() {
    const Ticket = await ethers.getContractFactory("Ticket")
    const ticket = await Ticket.deploy()
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
  