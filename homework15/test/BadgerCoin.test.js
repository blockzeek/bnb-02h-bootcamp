// Import the required dependencies
const {expect} = require('chai');
const {ethers} = require('hardhat');

// Describe the contract and its tests
describe('BadgerCoin', function () { // Define the contract and the accounts to use
    let BadgerCoin;
    let badgerCoin;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    const totalSupply = ethers.utils.parseUnits('1000000', 18);

    // Set up the contract and accounts for each test
    before(async function () {
        BadgerCoin = await ethers.getContractFactory('BadgerCoin');
        badgerCoin = await BadgerCoin.deploy();
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
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

    describe("Approve and TransferFrom", () => {
        it("Should approve tokens and transferFrom successfully", async () => {
            const approveAmount = 100;
            await badgerCoin.connect(addr1).approve(addr2.address, approveAmount);
            const allowance = await badgerCoin.allowance(addr1.address, addr2.address);
            expect(allowance).to.equal(approveAmount);

            await badgerCoin.connect(addr2).transferFrom(addr1.address, addr3.address, approveAmount);
            const addr3Balance = await badgerCoin.balanceOf(addr3.address);
            expect(addr3Balance).to.equal(approveAmount);
        });
    });

    describe("Pausable functionality", () => {
        it("Should not allow transfers when paused", async () => {
            await badgerCoin.pause();

            const transferAmount = 50;
            await expect(badgerCoin.connect(addr1).transfer(addr2.address, transferAmount)).to.be.revertedWith("Pausable: paused");
        });

        it("Should allow transfers when unpaused", async () => {
            await badgerCoin.unpause();

            const transferAmount = 50;
            await badgerCoin.connect(addr1).transfer(addr2.address, transferAmount);
            const addr2Balance = await badgerCoin.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(transferAmount);
        });
    });
});
