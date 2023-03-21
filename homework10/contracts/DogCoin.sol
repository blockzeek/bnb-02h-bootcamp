// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.18;

contract DogCoin {
    uint256 totalSupply;
    address owner;
    mapping(address => uint256) public balances;
    struct Payment {
        uint256 amount;
        address recipient;
    }
    mapping(address => Payment[]) payments;

    event TotalSupplyChanged(uint256);
    event BalanceAmountTransferred(uint256, address);

    constructor() {
        totalSupply = 2000000;
        owner = msg.sender;
        balances[owner] = totalSupply;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    function increaseTotalSupply() public onlyOwner {
        _mint(1000);
    }

    function _mint(uint256 amount) internal {
        totalSupply = totalSupply + amount;
        balances[owner] += amount;
        emit TotalSupplyChanged(totalSupply);
    }

    function transfer(uint256 amount, address recipient) public {
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
        payments[msg.sender].push(Payment(amount, recipient));
        emit BalanceAmountTransferred(amount, recipient);
    }

    function getPayments(
        address sender
    ) public view returns (Payment[] memory) {
        return payments[sender];
    }
}
