const {
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
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
    const GOHM = await ethers.getContractFactory("MockGOHM");
    const gohm = await GOHM.deploy();
    await gohm.deployed();
    const FRAX = await ethers.getContractFactory("MockFRAX");
    const frax = await FRAX.deploy();
    await frax.deployed();
    const DAI = await ethers.getContractFactory("MockDAI");
    const dai = await DAI.deploy();
    await dai.deployed();
    
    const Ticket = await ethers.getContractFactory("Ticket");
    const ticket = await Ticket.deploy(MULTISIG, "0x0000000000000000000000000000000000000000", gohm.address, frax.address, dai.address);

    const INPERSONTICKETNFT = await ethers.getContractFactory("InPersonTicketNFT");
    const inPersonTicketNFT = await INPERSONTICKETNFT.deploy(ticket.address);
    await inPersonTicketNFT.deployed();
    await inPersonTicketNFT.setTicketInventories(1);
    expect((await inPersonTicketNFT.ticketInventories()).toNumber()).to.equal(1);
    
    await ticket.setInPersonTicketNFTAddr(inPersonTicketNFT.address);

    // set ticket price
    await ticket.setTicketPrice("2022-in-person", true,  ethers.utils.parseUnits("33", 18));
    await ticket.setTicketPrice("2022-in-person", false,  ethers.utils.parseUnits("0.003", 18));

    return { ticket, inPersonTicketNFT, dai, owner, otherAccount, gohm };
  }

  async function _buyTicket() {
    const { ticket, gohm, otherAccount, inPersonTicketNFT, dai } = await loadFixture(deployTicketFixture);
    await gohm.transfer(otherAccount.address, ethers.utils.parseUnits("0.003", 18));

    await gohm.connect(otherAccount).approve(ticket.address, ethers.utils.parseUnits("1", 18))
    await ticket.connect(otherAccount).buyTicket("gohm", "2022-in-person", false)
    expect(ethers.utils.formatUnits(await gohm.balanceOf(ticket.address), 18)).to.equal('0.003')
    
    return { ticket, gohm, otherAccount, inPersonTicketNFT, dai };

  }

  describe("Test Ticket Contract", function () {
    it("setTicketPrice: Should set the right price", async function () {
      const { ticket } = await loadFixture(deployTicketFixture);
      expect((await ticket.usdTicketPrices("2022-in-person")).toString()).to.equal(ethers.utils.parseUnits("33", 18).toString());
      expect((await ticket.gohmTicketPrices("2022-in-person")).toString()).to.equal(ethers.utils.parseUnits("0.003", 18).toString());
    });

    it("Should set the right owner", async function () {
      const { ticket, owner } = await loadFixture(deployTicketFixture);
      expect(await ticket.owner()).to.equal(owner.address);
    });

    it("buyTicket: Shoud charge user token and mint them NFT as ticket!", async function () {
      const { ticket, dai, otherAccount, inPersonTicketNFT, gohm } = await loadFixture(_buyTicket);
      const ownerDaiBalance = await dai.balanceOf(otherAccount.address);
      expect(ownerDaiBalance.toNumber()).to.equal(0);
      const ownerGohmBalance = await gohm.balanceOf(otherAccount.address);
      expect(ownerGohmBalance.toNumber()).to.equal(0);
      expect((await inPersonTicketNFT.balanceOf(otherAccount.address)).toNumber()).to.equal(1);
      expect((await inPersonTicketNFT.ownerOf(1))).to.equal(otherAccount.address);
      
      const gohmBalanceOfTicketContract = (await gohm.balanceOf(ticket.address))
      expect(ethers.utils.formatUnits(gohmBalanceOfTicketContract, 18)).to.equal('0.003')
      const daiBalanceOfTicketContract = (await dai.balanceOf(ticket.address))
      expect(ethers.utils.formatUnits(daiBalanceOfTicketContract, 18)).to.equal('0.0')
    });

    it("withdrawToken: Shoud withdraw token to user wallet!", async function () {
      // withdraw!
      const { ticket, gohm } = await loadFixture(_buyTicket);
      await ticket.withdrawToken()
      const balanceOfOwnerWallet = (await gohm.balanceOf(MULTISIG))
      expect(ethers.utils.formatUnits(balanceOfOwnerWallet, 18)).to.equal('0.003')
      expect(ethers.utils.formatUnits(await gohm.balanceOf(ticket.address)), 18).to.equal("0.0");
    });

    it("withdrawToken: Should withdraw ticket revenue to multi-sig wallet!", async function () {
      // here we use owner's address as multi-sig wallet!
      const { ticket, owner } = await loadFixture(deployTicketFixture);
      expect(await ticket.owner()).to.equal(owner.address);
    });
    
  });
  describe("Test inPersonTicketNFT Contract", function () {
    it("Should raise revert transaction when it exceeds ticket inventories!", async function () {
      const { ticket, dai, otherAccount, inPersonTicketNFT } = await loadFixture(deployTicketFixture);
      await dai.transfer(otherAccount.address, ethers.utils.parseUnits("33", 18));
      await dai.connect(otherAccount).approve(ticket.address, ethers.utils.parseUnits("33", 18))
      await ticket.connect(otherAccount).buyTicket("dai", "2022-in-person", true)
      expect((await inPersonTicketNFT.tokenIds()).toNumber()).to.equal(1);
      try {
        await ticket.connect(otherAccount).buyTicket("dai", "2022-in-person", true)
      } catch (error) {
        // Exceed ticket inventories!
        expect(error.message).to.equal("VM Exception while processing transaction: reverted with reason string 'Error'")
      }
    });    
  });
});
