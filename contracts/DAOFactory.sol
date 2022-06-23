// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './proxy/ProxyFactory.sol';
import './proxy/ProxyAdmin.sol';
import './interfaces/IGovernor.sol';
import './interfaces/ITimelock.sol';
import './interfaces/IVotes.sol';
import './interfaces/IGTokenFactory.sol';
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract DAOFactory is Initializable, ProxyFactory {
    
    /* ===== EVENTS ===== */

    event DAOCreated(uint256 id, DAO dao);

    event DAOUpdated(uint256 id, DAO updatedDao);

    event DAORetired(uint256 id);

    event DAOBlacklisted(uint256 id);

    event OwnerChanged(address prevOwner, address newOwner);

    struct DAO {
        bytes32 infoHash;
        address proxyAdmin;
        address governor;
        IGTokenFactory.GTokenStandard standard;
        bool isRetired;
        bool isBlacklisted;
    }

    address private governorLogic;
    address private timelockLogic;
    address private gTokenFactory;
    uint256 private daoId;
    address private owner;

    uint256 internal constant DAO_STORAGE_SIZE = 3;

    mapping(uint256 => DAO) public daos;

    modifier onlyOwner() {
        require(msg.sender == owner, "DAOFactory: call must come from owner.");
        _;
    }

    function initialize(address _governorLogic, address _timelockLogic, address _gTokenFactory, address _owner) public initializer {
        governorLogic = _governorLogic;
        timelockLogic = _timelockLogic;
        gTokenFactory = _gTokenFactory;
        owner = _owner;
    }

    
    /* ===== INTERNAL FUNCTIONS ===== */

    function _createGovernor(address _admin, address[] memory _founders, IGovernor.GovernorConfig memory _config, address _timelock, address _gToken) internal returns (address governor_) {
        bytes memory initializeData = abi.encodeWithSignature(
            "initialize(address[],(uint32,uint32,uint32,uint32,uint32,uint32,uint32,uint8,bool),address,address)",
            _founders, _config, _timelock, _gToken     
        );
        governor_ = _createProxy(governorLogic, _admin, initializeData);
    }

    function _createTimelock(address _admin, ITimelock.TimelockConfig memory _config) internal returns (address timelock_){
        bytes memory initializeData = abi.encodeWithSignature(
            "initialize((uint32,uint32,uint32,uint32),address)",
            _config, address(this)
        );
        timelock_ = _createProxy(timelockLogic, _admin, initializeData);
    }

    function _createGToken(address _timelock, address _gToken, IGTokenFactory.GTokenStandard _standard, IVotes.Initialization memory _initialization) internal returns (address gToken_) {
        if (_gToken == address(0)) {
            gToken_ = IGTokenFactory(gTokenFactory).createToken(_standard, _initialization, _timelock);
        } else {
            gToken_ = _gToken;
        }
    }

    function _createDAO(address[] memory _founders, IGovernor.GovernorConfig memory _governorConfig, ITimelock.TimelockConfig memory _timelockConfig, address _gToken, IGTokenFactory.GTokenStandard _standard, IVotes.Initialization memory _initialization, bytes32 _infoHash) internal returns (uint256) {
        address admin = _createProxyAdmin();
        address timelock = _createTimelock(admin, _timelockConfig);
        address gToken = _createGToken(timelock, _gToken, _standard, _initialization);
        address governor = _createGovernor(admin, _founders, _governorConfig, timelock, gToken);
        ProxyAdmin(admin).transferOwnership(timelock);     
        ITimelock(timelock).setGovernor(governor);

        DAO storage dao = daos[daoId];
        dao.infoHash = _infoHash;
        dao.proxyAdmin = admin;
        dao.governor = governor;
        dao.standard = _standard;

        emit DAOCreated(daoId, dao);

        daoId++;
        return daoId;
    }

    function _updateDAO(uint256 _daoId, DAO memory _updatedDAO) internal {
        require(isDAOExisted(_daoId) == true, "DAOFactory::_updateDAO: DAO is not existed!");
        require(isDAORetired(_daoId) == true, "DAOFactory::_updateDAO: DAO is retired!");
        DAO memory dao = daos[_daoId];
        require(msg.sender == address(IGovernor(dao.governor).timelock()), "DAOFactory::_updateDAO: Update call must come from timelock!");

        daos[_daoId] = _updatedDAO;
        emit DAOUpdated(_daoId, _updatedDAO);
    }

    function _loadDAO(uint256 index) internal view returns (bytes32[DAO_STORAGE_SIZE] memory store){
        DAO storage where = daos[index];
        assembly {
            // 3 sloads
            mstore(add(store, 0x00), sload(add(where.slot, 0)))
            mstore(add(store, 0x20), sload(add(where.slot, 1)))
            mstore(add(store, 0x40), sload(add(where.slot, 2)))
        }
    }


    /* ===== VIEW FUNCTIONS ===== */

    function daosInfo(uint256[] calldata _ids) external view returns (bytes32[DAO_STORAGE_SIZE][] memory stores) {
        stores = new bytes32[DAO_STORAGE_SIZE][](_ids.length);
        for (uint256 i; i < stores.length; i++) {
            stores[i] = _loadDAO(_ids[i]);
        }
    }
    
    function getTotalDAOs() view public returns (uint256) {
        return daoId;
    }

    function isDAOExisted(uint256 _daoId) view public returns (bool) {
        DAO memory dao = daos[_daoId];
        return (dao.governor != address(0));
    }

    function isDAORetired(uint256 _daoId) view public returns (bool) {
        DAO memory dao = daos[_daoId];
        return dao.isRetired;
    }

    function isDAOBlacklisted(uint256 _daoId) view public returns(bool) {
        DAO memory dao = daos[_daoId];
        return dao.isBlacklisted;
    }

    function getDAOIds(bool blacklist) view public returns(uint256[] memory) {
        uint256 count = 0;
        for (uint256 id = 0; id < daoId; id++) {
            if (isDAOBlacklisted(id) == blacklist) continue;
            count++;
        }
        uint256[] memory ids = new uint256[](count);
        count = 0;
        for (uint256 id = 0; id < daoId; id++) {
            if (isDAOBlacklisted(id) == blacklist) continue;
            ids[count] = id;
            count++;
        }
        return ids;
    }

    
    // function getDAOs(uint256[] calldata ids) returns (bytes[] memory){

    // }

    /* ===== MUTATIVE FUNCTIONS ===== */

    function createDAO(address[] memory _founders, IGovernor.GovernorConfig memory _governorConfig, ITimelock.TimelockConfig memory _timelockConfig, address _gToken, IGTokenFactory.GTokenStandard _standard, IVotes.Initialization memory _initialization, bytes32 _infoHash) external payable returns (uint256) {
        return _createDAO(_founders, _governorConfig, _timelockConfig, _gToken, _standard, _initialization, _infoHash);
    }

    function updateDAO(uint256 _daoId, DAO memory _updatedDAO) external {
        _updateDAO(_daoId, _updatedDAO);
    }
    
    function retireDAO(uint256 _daoId) external {
        DAO storage dao = daos[_daoId];
        dao.isRetired = true;

        _updateDAO(_daoId, dao);
    }

    function blacklistDAO(uint256 _daoId) external onlyOwner {
        require(isDAOExisted(_daoId) == true, "DAOFactory::_updateDAO: DAO is not existed!");

        DAO storage dao = daos[_daoId];
        dao.isBlacklisted = true;

        emit DAOBlacklisted(_daoId);
    }

    function changeOwner(address newOwner) external onlyOwner {
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }
}