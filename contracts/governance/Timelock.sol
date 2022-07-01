// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../interfaces/ITimelock.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';


contract Timelock is Initializable, ITimelock {

    TimelockConfig public config;
    address private governor;
    mapping (bytes32 => bool) public queuedTransactions;

    modifier onlyGovernor() {
        require(msg.sender == governor, "Timelock: call must come from governor.");
        _;
    }
    
    /* ========== FUNCTIONS ========== */

    function initialize(TimelockConfig memory _config, address _governor) public initializer {
        _updateConfig(_config);
        _setGovernor(_governor);
    }


    /* ========== INTERNAL FUNCTIONS ========== */

    function _validateConfig(TimelockConfig memory _config) internal pure returns (bool){
        require(_config.delay >= _config.minTimelockDelay && _config.delay <= _config.maxTimelockDelay, "Timelock::validateConfig: out of range timelock delay.");
    }

    /**
     * @notice Set new timelock delay value. Requires call from timelock itself.
     * @param _config New configuration.
     */
    function _updateConfig(TimelockConfig memory _config) internal {
        _validateConfig(_config);
        emit TimelockConfigUpdated(config, _config);
        config = _config;
    }

    function _setGovernor(address _governor) internal {
        governor = _governor;
        emit GovernorSet(_governor);
    }

    /* ========== VIEW FUNCTIONS ========== */

    function validateConfig(TimelockConfig memory _config) external view returns (bool) {
        return _validateConfig(_config);
    }

    function delay() public view returns (uint32){
        return config.delay;
    }

    function gracePeriod() public view returns(uint32) {
        return config.gracePeriod;
    }

    function isDeprecated() public view returns(bool) {
        return governor == address(0);
    }


    /* ========== MUTATIVE FUNCTIONS ========== */

    function setGovernor(address _governor) external onlyGovernor {
        _setGovernor(_governor);
    }

    function updateConfig(TimelockConfig memory _config) public {
        require(msg.sender == address(this), "Timelock::setDelay: Call must come from Timelock.");
        _updateConfig(_config);
    }

    /**
     * @notice Queue a transaction. Requires call from admin.
     * @param _target Target contract
     * @param _value Call value
     * @param _signature Target function's signature
     * @param _data Calldata
     * @param _eta Estimation time of execution
     * @return txHash Queued transaction's hash
     */
    function queueTransaction(address _target, uint _value, string calldata _signature, bytes calldata _data, uint _eta) external onlyGovernor returns (bytes32) {
        require(_eta >= (block.timestamp + config.delay), "Timelock::queueTransaction: Estimated execution block must satisfy delay.");

        bytes32 txHash = keccak256(abi.encode(_target, _value, _signature, _data, _eta));
        queuedTransactions[txHash] = true;

        emit TransactionQueued(txHash, _target, _value, _signature, _data, _eta);
        return txHash;
    }

    /**
     * @notice Cancel a transaction. Requires call from admin.
     * @param _target Target contract
     * @param _value Call value
     * @param _signature Target function's signature
     * @param _data Calldata
     * @param _eta Estimation time of execution
     */
    function cancelTransaction(address _target, uint _value, string calldata _signature, bytes calldata _data, uint _eta) external onlyGovernor {
        bytes32 txHash = keccak256(abi.encode(_target, _value, _signature, _data, _eta));
        queuedTransactions[txHash] = false;

        emit TransactionCancelled(txHash, _target, _value, _signature, _data, _eta);
    }

    /**
     * @notice Execute a queued transaction. Requires call from admin.
     * @param _target Target contract
     * @param _value Call value
     * @param _signature Target function's signature
     * @param _data Calldata
     * @param _eta Estimation time of execution
     */
    function executeTransaction(address _target, uint _value, string calldata _signature, bytes calldata _data, uint _eta) external payable onlyGovernor returns (bytes memory) {
        bytes32 txHash = keccak256(abi.encode(_target, _value, _signature, _data, _eta));
        require(queuedTransactions[txHash], "Timelock::executeTransaction: Transaction hasn't been queued.");
        require(block.timestamp >= _eta, "Timelock::executeTransaction: Transaction hasn't surpassed time lock.");
        require(block.timestamp <= (_eta + config.gracePeriod), "Timelock::executeTransaction: Transaction is expired.");

        queuedTransactions[txHash] = false;

        bytes memory callData;

        if (bytes(_signature).length == 0) {
            callData = _data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(_signature))), _data);
        }

        (bool success, bytes memory returnData) = _target.call{value: _value}(callData);
        require(success, "Timelock::executeTransaction: Transaction execution reverted.");

        emit TransactionExecuted(txHash, _target, _value, _signature, _data, _eta);

        return returnData;
    }

    /**
     * @notice Execute a emergency transaction by surpassing delay. Requires call from admin.
     * @param _target Target contract
     * @param _value Call value
     * @param _signature Target function's signature
     * @param _data Calldata
     */
    function emergencyTransaction(address _target, uint _value, string calldata _signature, bytes calldata _data) external payable onlyGovernor returns (bytes memory) {
        bytes32 txHash = keccak256(abi.encode(_target, _value, _signature, _data, block.timestamp));

        bytes memory callData;
        if (bytes(_signature).length == 0) {
            callData = _data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(_signature))), _data);
        }

        (bool success, bytes memory returnData) = _target.call{value: _value}(callData);
        require(success, "Timelock::emergencyTransaction: Transaction execution reverted.");

        emit TransactionExecuted(txHash, _target, _value, _signature, _data, block.timestamp);

        return returnData;
    }
}