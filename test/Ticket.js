const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const DECIMALS = ethers.BigNumber.from(10).pow(18)
const MULTISIG = "0x78000b0605E81ea9df54b33f72ebC61B5F5c8077"
describe("Ticket", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTicketFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const OHM = await ethers.getContractFactory("MockOHM");
    const ohm = await OHM.deploy();
    await ohm.deployed();
    const USDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await USDC.deploy();
    await usdc.deployed();
    const FRAX = await ethers.getContractFactory("MockFRAX");
    const frax = await FRAX.deploy();
    await frax.deployed();
    const DAI = await ethers.getContractFactory("MockDAI");
    const dai = await DAI.deploy();
    await dai.deployed();
    
    const Ticket = await ethers.getContractFactory("Ticket");
    const ticket = await Ticket.deploy(MULTISIG, "0x0000000000000000000000000000000000000000", ohm.address, usdc.address, frax.address, dai.address);

    const INPERSONTICKETNFT = await ethers.getContractFactory("InPersonTicketNFT");
    const inPersonTicketNFT = await INPERSONTICKETNFT.deploy(ticket.address);
    await inPersonTicketNFT.deployed();
    
    await ticket.setInPersonTicketNFTAddr(inPersonTicketNFT.address);

    // set ticket price
    await ticket.setTicketPrice("2022-in-person", true, 33);
    await ticket.setTicketPrice("2022-in-person", false, 3);

    return { ticket, inPersonTicketNFT, dai, owner, otherAccount };
  }

  describe("Test Ticket Contract", function () {
    it("setTicketPrice: Should set the right unlockTime", async function () {
      const { ticket } = await loadFixture(deployTicketFixture);
      expect((await ticket.usdTicketPrices("2022-in-person")).toNumber()).to.equal(33);
      expect((await ticket.ohmTicketPrices("2022-in-person")).toNumber()).to.equal(3);
    });

    it("Should set the right owner", async function () {
      const { ticket, owner } = await loadFixture(deployTicketFixture);
      expect(await ticket.owner()).to.equal(owner.address);
    });

    it("buyTicket: Shoud charge user token and mint them NFT as ticket!", async function () {
      const { owner, ticket, dai, otherAccount, inPersonTicketNFT } = await loadFixture(deployTicketFixture);
      await dai.transfer(otherAccount.address, ethers.utils.parseUnits("33", 18));

      await dai.connect(otherAccount).approve(ticket.address, ethers.utils.parseUnits("33", 18))
      await ticket.connect(otherAccount).buyTicket("dai", "2022-in-person", true)
      const ownerBalance = await dai.balanceOf(otherAccount.address);
      expect(ownerBalance.toNumber()).to.equal(0);
      expect((await inPersonTicketNFT.balanceOf(otherAccount.address)).toNumber()).to.equal(1);
      expect((await inPersonTicketNFT.ownerOf(1))).to.equal(otherAccount.address);
      
      const balanceOfTicketContract = (await dai.balanceOf(ticket.address)).div(DECIMALS)
      expect(balanceOfTicketContract.toNumber()).to.equal(33);
      
      // withdraw!
      await ticket.withdrawToken()
      const balanceOfOwnerWallet = (await dai.balanceOf(MULTISIG)).div(DECIMALS)
      expect(balanceOfOwnerWallet.toNumber()).to.equal(33);
      expect((await dai.balanceOf(ticket.address)).div(DECIMALS).toNumber()).to.equal(0);
    });

    it("withdrawToken: Should withdraw ticket revenue to multi-sig wallet!", async function () {
      // here we use owner's address as multi-sig wallet!
      const { ticket, owner } = await loadFixture(deployTicketFixture);
      expect(await ticket.owner()).to.equal(owner.address);
    });

  });
});
