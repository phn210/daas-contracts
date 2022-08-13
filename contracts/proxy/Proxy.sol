// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {

    /* ===== VARIABLES ===== */

    /**
     * @notice Storage slot with the address of the current implementation.
     * @dev Keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1, and is validated in the constructor.
     */
    bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    /// FIXME: add admin address to constructor
    constructor(
        address _logic,
        bytes memory _data
    ) payable {
        assert(_IMPLEMENTATION_SLOT == bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1));
        _setImplementationAndCall(_logic, _data);
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

    function _setImplementationAndCall(address newImplementation, bytes memory data) internal {
        _setImplementation(newImplementation);
        _delegateTo(newImplementation, data);
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
     * @notice Returns the current implementation.
     * @dev Only the admin can call this function. See {ProxyAdmin-getProxyImplementation}.
     * @dev Clients can read directly from storage slot.
     */
    function implementation() external returns (address implementation_) {
        implementation_ = _getImplementation();
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

    function _fallback() internal {
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