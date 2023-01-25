async function main() {
    // remember to update addresses of ohm, frax, dai and usdc!
    for (const token of ['MockGOHM', 'MockFRAX', 'MockDAI']) {
      const tokenInstance = await ethers.getContractFactory(token);
      const deployedToken = await tokenInstance.deploy();
      deployedToken.deployed();
      console.log(`${token} Contract deployed to address: `, deployedToken.address)
      await deployedToken.transfer(process.env.PUBLIC_KEY, ethers.utils.parseUnits("100", 18));
    }
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
  