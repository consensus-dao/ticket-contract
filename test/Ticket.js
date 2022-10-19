const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Ticket", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTicketFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const DAI = await ethers.getContractFactory("MockDAI");
    const dai = await DAI.deploy();
    await dai.deployed();
    
    const Ticket = await ethers.getContractFactory("Ticket");
    // owner.address here is just a place holder
    const ticket = await Ticket.deploy("0x78000b0605E81ea9df54b33f72ebC61B5F5c8077", owner.address, dai.address, dai.address, dai.address, dai.address, dai.address);

    const INPERSONTICKETNFT = await ethers.getContractFactory("InPersonTicketNFT");
    const inPersonTicketNFT = await INPERSONTICKETNFT.deploy(ticket.address);
    await inPersonTicketNFT.deployed();
    
    await ticket.setInPersonTicketNFTAddr(inPersonTicketNFT.address);
    return { ticket, inPersonTicketNFT, dai, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right unlockTime", async function () {
      const { ticket } = await loadFixture(deployTicketFixture);
      await ticket.setTicketPrice("earlyBird", true, 33);
      await ticket.setTicketPrice("earlyBird", false, 3);
      expect((await ticket.usdTicketPrices("earlyBird")).toNumber()).to.equal(33);
      expect((await ticket.ohmTicketPrices("earlyBird")).toNumber()).to.equal(3);
    });

    it("Should set the right owner", async function () {
      const { ticket, owner } = await loadFixture(deployTicketFixture);
      expect(await ticket.owner()).to.equal(owner.address);
    });

    it("Buy Ticket", async function () {
      const { ticket, dai, owner, otherAccount } = await loadFixture(deployTicketFixture);
      console.log(owner.address)
      console.log(otherAccount.address)
      await ticket.setTicketPrice("earlyBird", true, 33);
      await ticket.setTicketPrice("earlyBird", false, 3);
      const ownerBalance = await dai.balanceOf(otherAccount.address);
      console.log(`ownerBalance: ${ownerBalance}`)
      await dai.transfer(otherAccount.address, ethers.utils.parseUnits("33", 18));
      console.log(`ownerBalance: ${await dai.balanceOf(otherAccount.address)}`);
      await dai.connect(otherAccount).approve(ticket.address, ethers.utils.parseUnits("33", 18))
      console.log('Amount that ticket is allowed to spend: ', await dai.allowance(otherAccount.address, ticket.address))
      await ticket.connect(otherAccount).buyTicket("dai", "earlyBird", true)
      // expect(await ticket.owner()).to.equal(owner.address);
    });

  });
});
