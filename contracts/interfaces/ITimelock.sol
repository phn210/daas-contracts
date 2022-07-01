// SPDX-License-Identifier: MIT

interface ITimelock {

    struct TimelockConfig {
        uint32 minTimelockDelay;
        uint32 maxTimelockDelay;
        uint32 delay;
        uint32 gracePeriod;
    }

    /* ========== EVENTS ========== */

    /**
     * @notice Emitt when timelock's config is updated.
     * @param newConfig Timelock's new configuration.
     */
    event TimelockConfigUpdated(TimelockConfig oldConfig, TimelockConfig newConfig);

    event GovernorSet(address governor);

    /**
     * @notice Emitted when governor migrated to new timelock.
     * @param newTimelock New timelock address.
     */    
    event Migrated(address newTimelock);

    /**
     * @notice Emitted when a transaction is cancelled.
     * @param txHash Cancelled transaction's hash
     * @param target Targeted contract
     * @param value Call's value
     * @param signature Target function's signature
     * @param data Calldata
     * @param eta Estimated time for execution
     */
    event TransactionCancelled(bytes32 indexed txHash, address indexed target, uint value, string signature, bytes data, uint eta);

    /**
     * @notice Emitted when a transaction is queued.
     * @param txHash Queued transaction's hash
     * @param target Targeted contract
     * @param value Call's value
     * @param signature Target function's signature
     * @param data Calldata
     * @param eta Estimated time for execution
     */
    event TransactionQueued(bytes32 indexed txHash, address indexed target, uint value, string signature, bytes data, uint eta);

    /**
     * @notice Emitted when a transaction is executed.
     * @param txHash Executed transaction's hash
     * @param target Targeted contract
     * @param value Call's value
     * @param signature Target function's signature
     * @param data Calldata
     * @param eta Time of execution
     */
    event TransactionExecuted(bytes32 indexed txHash, address indexed target, uint value, string signature,  bytes data, uint eta);


    /* ========== FUNCTIONS ========== */

    function delay() external view returns (uint32);
    function gracePeriod() external view returns (uint32);
    function queuedTransactions(bytes32 hash) external view returns (bool);
    function queueTransaction(address target, uint value, string calldata signature, bytes calldata data, uint eta) external returns (bytes32);
    function cancelTransaction(address target, uint value, string calldata signature, bytes calldata data, uint eta) external;
    function executeTransaction(address target, uint value, string calldata signature, bytes calldata data, uint eta) external payable returns (bytes memory);
    function emergencyTransaction(address target, uint value, string calldata signature, bytes calldata data) external payable returns (bytes memory);
    function setGovernor(address governor) external;
}