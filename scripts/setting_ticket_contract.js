async function main() {
    const ticketContract = await (await ethers.getContractFactory("Ticket")).attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0")
    // console.log(await ticketContract.usdt())
    await ticketContract.setTicketPrice("earlyBird", true, 1)
    await ticketContract.setTicketPrice("earlyBird", false, 1)
    console.log(await ticketContract.getTicketPrice("earlyBird", true))
    console.log(await ticketContract.getTicketPrice("earlyBird", false))
}
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  