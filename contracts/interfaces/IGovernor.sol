// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ITimelock.sol';
import './IVotes.sol';

interface IGovernor {

    struct GovernorBaseConfig {
        uint32 minVotingDelay;
        uint32 maxVotingDelay;
        uint32 minVotingPeriod;
        uint32 maxVotingPeriod;
        bool isWhitelistRequired;
    }

    struct GovernorConfig {
        uint32 votingDelay;
        uint32 votingPeriod;
        uint32 quorumAttendance;
        uint32 quorumApproval;
    }

    /// @notice Proposal's status
    enum ProposalState {
        Pending,
        Active,
        Canceled,
        Defeated,
        Succeeded,
        Queued,
        Expired,
        Executed
    }

    /// @notice Information of a proposal saved in storage.
    struct Proposal {
        uint256 id;             // Unique hash for looking up a proposal.
        uint128 forVotes;       // Current number of votes in favor of this proposal.
        uint128 againstVotes;   // Current number of votes in opposition to this proposal.
        uint128 abstainVotes;   // Current number of votes in abstain to this proposal.
        uint64 startBlock;      // The block at which voting begins: veTrava must be locked prior to this block to possess voting power.
        uint32 duration;        // Voting duration to calc the block at which voting ends: votes must be cast prior to this block.
        uint32 eta;             // The timestamp that the proposal will be available for execution, set once the vote succeeds.
        address proposer;       // Creator of the proposal.
        uint32 quorumAttendance;// 
        uint32 quorumApproval;  //
        bool canceled;          // Flag marking whether the proposal has been canceled.
        bool executed;          // Flag marking whether the proposal has been executed.
        ITimelock timelock;     // Timelock address for execution.
        mapping (address => Receipt) receipts;      // Receipts of ballots for the entire set of voters.
    }

    struct Action {
        address target;
        uint256 value;
        string signature;
        bytes data;
    }

    /**
     * @notice Ballot receipt record for a voter.
     */
    struct Receipt {
        uint128 votes;          // The number of votes the voter had, which were cast.
        uint32 timestamp;       // Timestamp of user's last votes for proposal.
        uint8 support;          // Whether or not the voter supports the proposal.
        bool hasVoted;          // Whether or not a vote has been cast.
    }

    /**
     * @notice Emitted when a valid proposal is created.
     */
    event ProposalCreated( 
        uint256 index,
        uint256 proposalId,
        address proposer,
        address timelock,
        Action[] actions,
        uint256 startBlock,
        uint256 endBlock,
        bytes32 descriptionHash
    );

    /**
     * @notice Emitted when a proposal is canceled.
     */
    event ProposalCanceled(uint256 proposalId);

    /**
     * @notice Emitted when a proposal is queued in the Timelock.
     */
    event ProposalQueued(uint256 proposalId, uint256 eta);

    /**
     * @notice Emitted when a proposal is executed from Timelock.
     */
    event ProposalExecuted(uint256 proposalId);

    /**
     * @notice Emitted when an emergency call occurred.
     */
    event EmergencyActions(
        address guardian,
        address timelock,
        Action[] actions,
        string description
    );

    /// @notice Emitted when a vote casted.
    event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason);
    
    event GovernorBaseConfigUpdated(GovernorBaseConfig oldConfig, GovernorBaseConfig newConfig);

    event AdminsUpdated(address[] admins);

    event GovernorConfigsUpdated(GovernorConfig[] configs);

    /// @notice Emitted when a new timelock contract is set.
    event TimelocksUpdated(ITimelock[] timelocks);

    /// @notice Emitted when whitelist account expiration is set.
    event WhitelistProposerExpirationSet(address account, uint expirtation);

    /// @notice Emitted when the whitelistGuardian is set.
    event NewGuardianSet(address oldGuardian, address newGuardian);

    // function configs() external returns (GovernorConfig[] memory);
    // function configs(uint256 index) external return (GovernorConfig);
    // function timelocks() external returns (ITimelock[] memory);
    function timelocks(uint256 index) external returns (ITimelock);

    /**
     * @notice Propose a new proposal with special requirements for proposer.
     * @param timelock Target contracts
     * @param config Governor Config index
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */

    function propose(
        uint256 timelock,
        uint256 config,
        Action[] memory actions,
        bytes32 descriptionHash
    ) external returns (uint256 proposalId);

    /**
     * @notice Queue a succeeded proposal. This requires the quorum to be reached, the vote to be successful, and the voting period has ended.
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */
    function queue(
        Action[] memory actions,
        bytes32 descriptionHash
    ) external;

    /**
     * @notice Execute a succeeded proposal. This requires the quorum to be reached, the vote to be successful, and the timelock delay period has passed.
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */
    function execute(
        Action[] memory actions,
        bytes32 descriptionHash
    ) external payable;

    /**
     * @notice Cancel a queued proposal. This requires the proposer has not been executed yet.
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */
    function cancel(
        Action[] memory actions,
        bytes32 descriptionHash
    ) external;

    /**
     * @notice Perform emergency actions for protocol's stability & development. This requires guardian authority.
     * @param actions Proposal's actions
     * @param description Explaination for emergency actions
     */
    function emergencyCall(
        uint256 timelock,
        Action[] memory actions,
        string memory description
    ) external payable;

    /**
     * @notice Cast vote for a proposal.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote (0 = Against, 1 = For, 2 = Abstain)
     */
    function castVote(uint256 proposalId, uint8 support) external;

    /**
     * @notice Cast vote for a proposal with reason.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote (0 = Against, 1 = For, 2 = Abstain)
     * @param reason The reason given for the vote by user
     */
    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external;

    /**
     * @notice Cast vote for a proposal by signature.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote (0 = Against, 1 = For)
     * @param v v
     * @param r r
     * @param s s
     */
    function castVoteBySig(
        uint256 proposalId,
        uint8 support,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;


}