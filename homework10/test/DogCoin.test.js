const {expect} = require('chai');
const {ethers} = require('hardhat');

describe("DogCoin", function () {
  let dogCoin;
  let owner;
  let alice;
  let bob;

  beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    const DogCoin = await ethers.getContractFactory("DogCoin", owner);
    dogCoin = await DogCoin.deploy();
  });

  describe("increaseTotalSupply", function () {
    it("should increase the total supply in steps of 1000", async function () {
      const initialTotalSupply = await dogCoin.getTotalSupply();
      await dogCoin.increaseTotalSupply();
      const totalSupplyAfterFirstIncrease = await dogCoin.getTotalSupply();
      expect(totalSupplyAfterFirstIncrease).to.equal(initialTotalSupply.toNumber() + 1000);

      await dogCoin.increaseTotalSupply();
      const totalSupplyAfterSecondIncrease = await dogCoin.getTotalSupply();
      expect(totalSupplyAfterSecondIncrease).to.equal(initialTotalSupply.toNumber() + 2000);
    });

    it("should only be callable by the contract owner", async function () {
      await expect(dogCoin.connect(alice).increaseTotalSupply()).to.be.revertedWith("Ownable: caller is not the owner");
      await expect(dogCoin.connect(bob).increaseTotalSupply()).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("transfer", function () {
    it("should emit the correct events when transfers occur", async function () {

      const initialBalance = await dogCoin.balances(owner.address);
      const amount = 100;
      const recipient = alice.address;

      const tx = await dogCoin.transfer(amount, recipient);
      const receipt = await tx.wait();

      const transferEvent = receipt.events.find((event) => event.event === "BalanceAmountTransferred");
      expect(transferEvent).to.not.be.undefined;
      expect(transferEvent.args[0].toNumber()).to.equal(amount);
      expect(transferEvent.args[1]).to.equal(recipient);

      const payments = await dogCoin.getPayments(owner.address);
      expect(payments[0][0].toNumber()).to.equal(amount);
      expect(payments[0][1]).to.equal(recipient);

      const balance = await dogCoin.balances(owner.address);
      expect(balance.toNumber()).to.equal(initialBalance.toNumber() - amount);
    });
  });
});
