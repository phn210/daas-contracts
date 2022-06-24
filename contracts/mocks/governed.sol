// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockGoverned {

    event OwnerSet(address newOwner);
    event InterestRateChanged(uint256 oldRate, uint256 newRate);
    event TokenWhitelisteToggled(address token, bool status);
    event PriceOracleSet(address token, address newOracle);

    address public owner;
    uint256 public interestRate;
    mapping (address => bool) public whitelistedTokens;
    mapping (address => address) public priceOracles;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    constructor (address _owner) {
        owner = _owner;
        emit OwnerSet(owner);
    }

    function setOwner(address newOwner) external payable onlyOwner {
        owner = newOwner;
        emit OwnerSet(newOwner);
    }

    function setInterestRate(uint256 newRate) external payable onlyOwner {
        require(newRate > 0, "Invalide rate!");
        uint256 oldRate = interestRate;
        interestRate = newRate;
        emit InterestRateChanged(oldRate, newRate);
    }

    function toggleWhitelistedToken(address token) external payable onlyOwner {
        bool status = !whitelistedTokens[token];
        whitelistedTokens[token] = status;
        emit TokenWhitelisteToggled(token, status);
    }

    function setPriceOracle(address token, address newOracle) external payable onlyOwner {
        priceOracles[token] = newOracle;
        emit PriceOracleSet(token, newOracle);
    }
}