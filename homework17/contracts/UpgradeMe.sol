// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.18;

contract UpgradeMe {
    enum PaymentOptions {
        Pay,
        Borrow,
        Defer,
        Extra
    }

    PaymentOptions options;
    PaymentOptions constant defaultChoice = PaymentOptions.Pay;

    mapping(address => uint256) balance;
    uint256 initialBlock;
    uint256 nextPayout = 0;
    string constant name = "Payout Tool";
    address immutable owner;

    constructor(address _owner) {
        owner = _owner;
        initialBlock = block.number;
        nextPayout = initialBlock;
    }

    function processPayment(
        PaymentOptions _option,
        address _to,
        uint256 _amount
    ) public {
        uint256 surcharge = 10;

        if (_option == PaymentOptions.Extra) {
            surcharge = 20;
        }
        if (_to == owner) {
            surcharge = 0;
        }
        uint256 transferAmount = _amount + surcharge;
        require(balance[msg.sender] > transferAmount, "Low Balance");
        balance[msg.sender] = balance[msg.sender] - transferAmount;
        balance[_to] = balance[_to] + transferAmount;
    }
}
