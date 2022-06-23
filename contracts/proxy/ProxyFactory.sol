// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './UpgradableProxy.sol';
import './ProxyAdmin.sol';
import '@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol';
// import '@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol';

contract ProxyFactory {

    event ProxyCreated(UpgradableProxy proxy, address implementation);

    function _createProxy(address _implementation, address _admin, bytes memory _initializeData) internal returns (address proxy_) {
        proxy_ = address(new UpgradableProxy(_implementation, _admin, _initializeData));
        // proxy_ = new TransparentUpgradeableProxy(_implementation, _admin, _initializeData);
    }

    function _createProxyAdmin() internal returns (address admin_) {
        admin_ = address(new ProxyAdmin());
    }

    function createProxy(address _implementation, address _admin, bytes memory _initializeData) external payable virtual returns (address proxy_) {
        proxy_ = _createProxy(_implementation, _admin, _initializeData);
    }

    function createProxyAdmin(address _owner) external virtual returns (address admin_) {
        admin_ = _createProxyAdmin();
        Ownable(admin_).transferOwnership(_owner);
    }
}