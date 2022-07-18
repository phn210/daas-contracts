// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../interfaces/IGTokenFactory.sol';
import '../token/ERC20Votes.sol';
import '../token/ERC721Votes.sol';
import '../utils/Ownable.sol';
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract GovernanceTokenFactory is IGTokenFactory {

    function _createERC20Votes(IVotes.Initialization memory _initialization) internal returns (address) {
        return address(new ERC20Votes(_initialization));
    }

    function _createERC721Votes(IVotes.Initialization memory _initialization) internal returns (address) {
        return address(new ERC721Votes(_initialization));
    }

    function _createToken(GTokenStandard _standard, IVotes.Initialization memory _initialization, address _owner) internal returns (address gToken_) {
        if (_standard == GTokenStandard.ERC20Votes) {
            gToken_ =  _createERC20Votes(_initialization);
        } else if (_standard == GTokenStandard.ERC721Votes) {
            gToken_ = _createERC721Votes(_initialization);
        }
        Ownable(gToken_).transferOwnership(_owner);
    }

    function createToken(GTokenStandard _standard, IVotes.Initialization memory _initialization, address _owner) external returns (address gToken_) {
        return _createToken(_standard, _initialization, _owner);
    }
}