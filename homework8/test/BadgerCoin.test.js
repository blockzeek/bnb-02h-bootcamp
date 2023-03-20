// Import the required dependencies
const { expect } = require('chai');
const { ethers } = require('hardhat');

// Describe the contract and its tests
describe('BadgerCoin', function () {

  // Define the contract and the accounts to use
  let BadgerCoin;
  let badgerCoin;
  let owner;
  let addr1;
  let addr2;
  const totalSupply = ethers.utils.parseUnits('1000000', 18);

  // Set up the contract and accounts for each test
  before(async function () {
    BadgerCoin = await ethers.getContractFactory('BadgerCoin');
    badgerCoin = await BadgerCoin.deploy();
    [owner, addr1, addr2] = await ethers.getSigners();
  });

  // Test total supply
  it('should set the total supply correctly', async function () {
    expect(await badgerCoin.totalSupply()).to.equal(totalSupply);
  });

  // Test number of decimals
  it('should set the number of decimals correctly', async function () {
    expect(await badgerCoin.decimals()).to.equal(18);
  });


  // Test the balanceOf function
  it('should return the correct balance for an account', async function () {
    expect(await badgerCoin.balanceOf(owner.address)).to.equal(totalSupply);
    expect(await badgerCoin.balanceOf(addr1.address)).to.equal(0);
  });

  // Test the transfer function
  it('should transfer tokens correctly', async function () {
    const amount = ethers.utils.parseUnits('100', 18);
    await badgerCoin.transfer(addr1.address, amount);
    expect(await badgerCoin.balanceOf(addr1.address)).to.equal(amount);
    expect(await badgerCoin.balanceOf(owner.address)).to.equal(totalSupply.sub(amount));
  });

  // Test that an error is produced if a transfer is created with an insufficient balance
  it('should not allow transfers with insufficient balance', async function () {
    const amount = ethers.utils.parseUnits('10000000', 18);
    await expect(badgerCoin.transfer(addr1.address, amount)).to.be.revertedWith('ERC20: transfer amount exceeds balance');
  });

});
