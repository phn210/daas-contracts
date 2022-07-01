// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./UpgradableProxy.sol";
import "../utils/Ownable.sol";

/**
 * @notice This contract is meant to be assigned as the admin of a {UpgradableProxy} contract.
 */
contract ProxyAdmin is Ownable {

    /**
     * @notice Returns the current implementation of `proxy`.
     * @param proxy Proxy contract address.
     */
    function getProxyImplementation(UpgradableProxy proxy) public view returns (address) {
        // We need to manually run the static call since the getter cannot be flagged as view
        // bytes4(keccak256("implementation()")) == 0x5c60da1b
        (bool success, bytes memory returndata) = address(proxy).staticcall(hex"5c60da1b");
        require(success);
        return abi.decode(returndata, (address));
    }

    /**
     * @notice Returns the current admin of `proxy`.
     * @param proxy Proxy contract address.
     */
    function getProxyAdmin(UpgradableProxy proxy) public view returns (address) {
        // We need to manually run the static call since the getter cannot be flagged as view
        // bytes4(keccak256("admin()")) == 0xf851a440
        (bool success, bytes memory returndata) = address(proxy).staticcall(hex"f851a440");
        require(success);
        return abi.decode(returndata, (address));
    }

    /**
     * @notice Changes the admin of `proxy` to `newAdmin`.
     * @param proxy Proxy contract address.
     * @param newAdmin New admin address.
     */
    function changeProxyAdmin(UpgradableProxy proxy, address newAdmin) public onlyOwner {
        proxy.changeAdmin(newAdmin);
    }

    /**
     * @notice Upgrades `proxy` to `implementation`.
     * @param proxy Proxy contract address.
     * @param implementation New logic version's implementation.
     */
    function upgrade(UpgradableProxy proxy, address implementation) public onlyOwner {
        proxy.upgradeTo(implementation);
    }

    /**
     * @notice Upgrades `proxy` to `implementation` and calls a function on the new implementation.
     * @param proxy Proxy contract address.
     * @param implementation New logic version's implementation.
     * @param data Calldata for function call in implementation.
     */
    function upgradeAndCall(
        UpgradableProxy proxy,
        address implementation,
        bytes memory data
    ) public payable onlyOwner {
        proxy.upgradeToAndCall{value: msg.value}(implementation, data);
    }
}
