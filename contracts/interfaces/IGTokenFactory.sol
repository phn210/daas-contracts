// SPDX-License-Identifier: MIT

import './IVotes.sol';

interface IGTokenFactory {

    enum GTokenStandard {
        ERC20Votes,
        ERC721Votes
    }

    function createToken(GTokenStandard _standard, IVotes.Initialization memory _initialization, address _owner) external returns (address gToken_);
}