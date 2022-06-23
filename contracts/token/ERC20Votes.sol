// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/extensions/ERC20Votes.sol)

pragma solidity ^0.8.0;

import "./ERC20.sol";
import "../governance/Votes.sol";
import "../libraries/Checkpoints.sol";

/**
 * @dev Extension of ERC20 to support Compound-like voting and delegation. This version is more generic than Compound's,
 * and supports token supply up to 2^224^ - 1, while COMP is limited to 2^96^ - 1.
 */
contract ERC20Votes is Votes, ERC20 {

    constructor(Initialization memory _initialization) ERC20(_initialization.name, _initialization.symbol, _initialization.decimals, _initialization.initialSupply, _initialization.owner) {}

    function _getVotingUnits(address account) internal view override returns (uint256) {
        return balanceOf(account);
    }

    /**
     * @dev Move voting power when tokens are transferred.
     *
     * Emits a {DelegateVotesChanged} event.
     */
    function _afterTokenTransfer(
        address from,
    address to,
        uint256 amount
    ) internal override {
        _transferVotingUnits(from, to, amount);
        super._afterTokenTransfer(from, to, amount);
    }
}
