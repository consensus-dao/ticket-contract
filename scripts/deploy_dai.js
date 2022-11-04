async function main() {
    // remember to update addresses of ohm, frax, dai and usdc!
    const mockdai = await ethers.getContractFactory("MockDAI");
    const MOCKDAI = await mockdai.deploy();
    MOCKDAI.deployed();
    console.log("MOCKDAI Contract deployed to address:", MOCKDAI.address)
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  