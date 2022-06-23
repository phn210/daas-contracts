// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UpgradableProxy {

    /* ===== EVENT ===== */

    /// @notice Emitted when the implementation is upgraded.
    event Upgraded(address indexed implementation);

    /// @notice Emitted when the admin account has changed.
    event AdminChanged(address previousAdmin, address newAdmin);


    /* ===== VARIABLES ===== */
    
    /// @dev Keccak-256 hash of "eip1967.proxy.rollback" subtracted by 1
    bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;

    /**
     * @notice Storage slot with the address of the current implementation.
     * @dev Keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /**
     * @notice Storage slot with the admin of the contract.
     * @dev Keccak-256 hash of "eip1967.proxy.admin" subtracted by 1, and is validated in the constructor.
     */
    bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

    /**
     * @notice Modifier used internally that will delegate the call to the implementation unless the sender is the admin.
     */
    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            _fallback();
        }
    }

    /// FIXME: add admin address to constructor
    constructor(
        address _logic,
        address admin_,
        bytes memory _data
    ) payable {
        assert(_ADMIN_SLOT == bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1));
        assert(_IMPLEMENTATION_SLOT == bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1));
        _changeAdmin(admin_);
        _upgradeToAndCall(_logic, _data, false);
    }


    /* ===== INTERNAL FUNCTIONS ===== */

    function _isContract(address _address) internal view returns (bool) {
        uint256 size;
        assembly { size := extcodesize(_address) }
        return size > 0;
    }

    function _getAddressAtSlot(bytes32 _slot) internal view returns (address address_) {
        assembly {
            address_ := sload(_slot)
        }
    }

    function _setAddressAtSlot(bytes32 _slot, address _address) internal {
        assembly {
            sstore(_slot, _address)
        }
    }

    /// @notice Returns the current implementation address.
    function _getImplementation() internal view returns (address) {
        return _getAddressAtSlot(_IMPLEMENTATION_SLOT);
    }

    /// @notice Stores a new address in the EIP1967 implementation slot.
    function _setImplementation(address newImplementation) private {
        require(_isContract(newImplementation), "ERC1967: new implementation is not a contract");
        _setAddressAtSlot(_IMPLEMENTATION_SLOT, newImplementation);
    }

    /// @notice Returns the current admin.
    function _getAdmin() internal view returns (address) {
        return _getAddressAtSlot(_ADMIN_SLOT);
    }

    /// @notice Stores a new address in the EIP1967 admin slot.
    function _setAdmin(address newAdmin) private {
        require(newAdmin != address(0), "ERC1967: new admin is the zero address");
        _setAddressAtSlot(_ADMIN_SLOT, newAdmin);
    }    
    /// Changes the admin of the proxy.
    function _changeAdmin(address newAdmin) internal {
        emit AdminChanged(_getAdmin(), newAdmin);
        _setAdmin(newAdmin);
    }

    /// @notice Perform implementation upgrade.
    function _upgradeTo(address newImplementation) internal {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /// @notice Perform implementation upgrade with additional setup call.
    function _upgradeToAndCall(
        address newImplementation,
        bytes memory data,
        bool forceCall
    ) internal {
        _upgradeTo(newImplementation);
        if (data.length > 0 || forceCall) {
            _delegateTo(newImplementation, data);
        }
    }

    function _delegateTo(address target, bytes memory data) internal {
        (bool success, bytes memory returnData) = target.delegatecall(data);
        assembly {
            if eq(success, 0) {
                revert(add(returnData, 0x20), returndatasize())
            }
        }
    }


    /* ===== VIEW FUNCTIONS ===== */

    /**
     * @notice Returns the current admin.
     * @dev Only the admin can call this function. See {ProxyAdmin-getProxyAdmin}.
     * @dev Clients can read directly from storage slot.
     */
    function admin() external ifAdmin returns (address admin_) {
        admin_ = _getAdmin();
    }

    /**
     * @notice Returns the current implementation.
     * @dev Only the admin can call this function. See {ProxyAdmin-getProxyImplementation}.
     * @dev Clients can read directly from storage slot.
     */
    function implementation() external ifAdmin returns (address implementation_) {
        implementation_ = _getImplementation();
    }


    /* ===== MUTATIVE FUNCTIONS ===== */

    /**
     * @notice Changes the admin of the proxy.
     * @dev Only the admin can call this function.
     */
    function changeAdmin(address newAdmin) external virtual ifAdmin {
        _changeAdmin(newAdmin);
    }

    /**
     * @notice Upgrade the implementation of the proxy.
     * @dev Only the admin can call this function.
     */
    function upgradeTo(address newImplementation) external ifAdmin {
        _upgradeTo(newImplementation);
    }

    /**
     * @dev Upgrade the implementation of the proxy, and then call a function from the new implementation as specified
     * by `data`, which should be an encoded function call. This is useful to initialize new storage variables in the
     * proxied contract.
     *
     * NOTE: Only the admin can call this function. See {ProxyAdmin-upgradeAndCall}.
     */
    function upgradeToAndCall(address newImplementation, bytes calldata data) external payable ifAdmin {
        _upgradeToAndCall(newImplementation, data, true);
    }


    /* ===== PROXY ===== */

    /**
     * @dev Delegates the current call to `implementation`.
     *
     * This function does not return to its internal call site, it will return directly to the external caller.
     */
    function _delegate(address _implementation) internal {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
    
    /**
     * @dev Makes sure the admin cannot access the fallback function. See {Proxy-_beforeFallback}.
     */
    function _beforeFallback() internal view {
        require(msg.sender != _getAdmin(), "Call from proxy admin cannot fallback to proxy target");
    }

    function _fallback() internal {
        _beforeFallback();
        _delegate(_getImplementation());
    }

    /**
     * @dev Fallback function that delegates calls to the address returned by `_implementation()`. Will run if no other
     * function in the contract matches the call data.
     */
    fallback() external payable {
        _fallback();
    }
}