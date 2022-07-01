// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC721/extensions/draft-ERC721Votes.sol)

pragma solidity ^0.8.0;

import "./ERC721.sol";
import "../governance/Votes.sol";

/**
 * @dev Extension of ERC721 to support voting and delegation as implemented by {Votes}, where each individual NFT counts
 * as 1 vote unit.
 *
 * Tokens do not count as votes until they are delegated, because votes must be tracked which incurs an additional cost
 * on every transfer. Token holders can either delegate to a trusted representative who will decide how to make use of
 * the votes in governance decisions, or they can delegate to themselves to be their own representative.
 *
 * _Available since v4.5._
 */
contract ERC721Votes is ERC721, Votes {
    
    constructor (Initialization memory _initialization) ERC721(_initialization.name, _initialization.symbol, _initialization.owner) {}

    function _getVotingUnits(address account) internal view override returns (uint256) {
        return balanceOf(account);
    }

    /**
     * @dev Adjusts votes when tokens are transferred.
     *
     * Emits a {Votes-DelegateVotesChanged} event.
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        _transferVotingUnits(from, to, 1);
        super._afterTokenTransfer(from, to, tokenId);
    }

    function mint(uint256 tokenId) external {
        _mint(msg.sender, tokenId);
    }
}
