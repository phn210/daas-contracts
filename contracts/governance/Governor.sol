// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../interfaces/IGovernor.sol';
import '../interfaces/ITimelock.sol';
import '../interfaces/IVotes.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';

contract Governor is Initializable, IGovernor {

    /// @notice The name of this contract
    string public name;

    /// @notice The version of this contract
    string public version;

    // The EIP-712 typehash for the contract's domain
    bytes32 public constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    // The EIP-712 typehash for the ballot struct used by the contract
    bytes32 public constant BALLOT_TYPEHASH = keccak256("Ballot(uint256 proposalId,uint8 support)");

    //
    address[] public founders;

    GovernorConfig public config;           
    
    // The address of the Timelock contract.
    ITimelock public timelock;

    // The address of the Governance Token contract.
    IVotes public gToken;

    // DAO info IPFS hash
    bytes32 public infoHash;

    // Address of whitelist guardian account.
    address public guardian;

    // Number of proposal created
    uint256 private proposalCount;

    /// @notice Index of proposals' ID.
    mapping (uint256 => uint256) public proposalIds;

    /// @notice Record of all proposals ever proposed.
    mapping (uint256 => Proposal) public proposals;

    /// @notice Stores the expiration of proposer whitelist status as a timestamp.
    mapping (address => uint256) public whitelistProposerExpirations;

    uint256 internal constant PROPOSAL_STORAGE_SIZE = 5;    // Used to read proposals data

    uint256 public constant QUORUM_DENOMINATOR = 100000;

    modifier onlyAuthority() {
        require(msg.sender == address(timelock) || msg.sender == guardian, "Governor: call must come from timelock or guardian.");
        _;
    }

    /* ========== FUNCTIONS ========== */

    /**
      * @notice Used as constructor of Governor contract
      * @param _founders Addresses of organization's founders
      * @param _config The initial config for a governor
      * @param _timelock The address of the Timelock contract
      * @param _gToken The address of the Governance Token contract
      */
    function initialize(address[] memory _founders, GovernorConfig memory _config, address _timelock, address _gToken) public initializer {
        require(_timelock != address(0), "Governor::initialize: timelock must not be address");
        require(_gToken != address(0), "Governor::initialize: governance token must not be address");

        founders = _founders;
        _updateConfig(_config);
        timelock = ITimelock(_timelock);
        gToken = IVotes(_gToken);
    }


    /* ========== INTERNAL FUNCTIONS ========== */
    
    /**
     * @notice Internal function to queue a transaction.
     * @param target Target contract
     * @param value Call' value
     * @param signature Target function' signature
     * @param data Calldata
     * @param eta Estimated time of execution
     */
    function _queueOrRevert(address target, uint256 value, string memory signature, bytes memory data, uint256 eta) internal {
        require(!timelock.queuedTransactions(keccak256(abi.encode(target, value, signature, data, eta))), "Governor::_queueOrRevert: action already queued at eta");
        timelock.queueTransaction(target, value, signature, data, eta);
    }

    /**
      * @notice Internal function that caries out voting logic.
      * @param voter User who casting their vote
      * @param proposalId The id of the proposal to vote on
      * @param support The support value for the vote (0 = Against, 1 = For)
      * @return Votes The weight of the vote cast
      */
    function _castVote(address voter, uint256 proposalId, uint8 support) internal returns (uint128) {
        require(state(proposalId) == ProposalState.Active, "Governor::_castVote: voting is closed");
        require(support <= 2, "Governor::_castVote: invalid vote type");
        Proposal storage proposal = proposals[proposalId];
        Receipt storage receipt = proposal.receipts[voter];
        require(receipt.hasVoted == false, "Governor::_castVote: voter already voted");
        uint128 votes = uint128(gToken.getPastVotes(voter, proposal.startBlock));
        require(votes > 0, "Governor::_castVote: zero voting power");

        if (support == 0) {
            proposal.againstVotes = proposal.againstVotes + votes;
        } else if (support == 1) {
            proposal.forVotes = proposal.forVotes + votes;
        } else if (support == 2) {
            proposal.abstainVotes = proposal.abstainVotes + votes;
        }

        receipt.hasVoted = true;
        receipt.support = support;
        receipt.votes = votes;
        receipt.timestamp = uint32(block.timestamp);

        return votes;
    }

    function _updateConfig(GovernorConfig memory newConfig) internal {
        validateConfig(newConfig);
        emit GovernorConfigUpdated(config, newConfig);
        config = newConfig;
    }
    
    /**
     * @notice Load a proposal's data from storage from index.
     * @param index The roposal's index
     * @return store Encoded proposal data
     */
    function _loadProposal(uint256 index) internal view returns (bytes32[PROPOSAL_STORAGE_SIZE] memory store){
        uint256 proposalId = proposalIds[index];
        Proposal storage where = proposals[proposalId];
        assembly {
            // 5 sloads
            mstore(add(store, 0x00), sload(add(where.slot, 0)))
            mstore(add(store, 0x20), sload(add(where.slot, 1)))
            mstore(add(store, 0x40), sload(add(where.slot, 2)))
            mstore(add(store, 0x60), sload(add(where.slot, 3)))
            mstore(add(store, 0x80), sload(add(where.slot, 4)))
        }
    }

    function _getChainId() internal view returns (uint chainId) {
        assembly { chainId := chainid() }
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    /**
     * @notice Propose a new proposal with special requirements for proposer.
     * @param targets Target contracts
     * @param values Calls' value
     * @param signatures Target functions' signature
     * @param calldatas Calldatas
     * @param descriptionHash IPFS hash of proposal's description
     * @return Proposal's index
     */
    function propose(address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas, bytes32 descriptionHash) external returns (uint256) {
        require(!config.isWhitelistRequired || isWhitelistedProposer(msg.sender), "Governor::propose: proposer needs to be whitelisted");
        require(targets.length == values.length && targets.length == signatures.length && targets.length == calldatas.length, "Governor::propose: proposal function information arity mismatch");
        require(targets.length <= config.proposalMaxOperations, "Governor::propose: too many actions");

        uint256 proposalId = hashProposal(targets, values, signatures, calldatas, descriptionHash);
        Proposal storage newProposal = proposals[proposalId];
        require(newProposal.startBlock == 0, "Governor::propose: proposal already existed");

        uint64 startBlock = uint64(block.number + config.votingDelay);
        uint32 duration = config.votingPeriod;

        newProposal.id = hashProposal(targets, values, signatures, calldatas, descriptionHash);
        newProposal.proposer = msg.sender;
        newProposal.eta = 0;
        newProposal.startBlock = startBlock;
        newProposal.duration = duration;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.abstainVotes = 0;
        newProposal.canceled = false;
        newProposal.executed = false;

        proposalIds[proposalCount] = proposalId;

        emit ProposalCreated(
            proposalCount,
            proposalId,
            msg.sender,
            targets,
            values,
            signatures,
            calldatas,
            startBlock,
            startBlock+duration,
            descriptionHash
        );

        proposalCount++;
        return proposalCount;
    }
    
    /**
     * @notice Queue a succeeded proposal. This requires the quorum to be reached, the vote to be successful, and the voting period has ended.
     * @param targets Target contracts
     * @param values Calls' value
     * @param signatures Target functions' signature
     * @param calldatas Calldatas
     * @param descriptionHash IPFS hash of proposal's description
     */
    function queue(address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas, bytes32 descriptionHash) external {
        uint256 proposalId = hashProposal(targets, values, signatures, calldatas, descriptionHash);
        require(state(proposalId) == ProposalState.Succeeded, "Governor::queue: proposal can only be queued if it is succeeded");
        Proposal storage proposal = proposals[proposalId];
        uint32 eta = uint32(block.timestamp + timelock.delay());
        for (uint256 i = 0; i < targets.length; i++) {
            _queueOrRevert(targets[i], values[i], signatures[i], calldatas[i], eta);
        }
        proposal.eta = eta;
        emit ProposalQueued(proposalId, eta);

    }

    /**
     * @notice Execute a succeeded proposal. This requires the quorum to be reached, the vote to be successful, and the timelock delay period has passed.
     * @param targets Target contracts
     * @param values Calls' value
     * @param signatures Target functions' signature
     * @param calldatas Calldatas
     * @param descriptionHash IPFS hash of proposal's description
     */
    function execute(address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas, bytes32 descriptionHash) external payable {
        uint256 proposalId = hashProposal(targets, values, signatures, calldatas, descriptionHash);
        require(state(proposalId) == ProposalState.Queued, "Governor::execute: proposal can only be executed if it is queued");
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        for (uint256 i = 0; i < targets.length; i++) {
            timelock.executeTransaction{value: values[i]}(targets[i], values[i], signatures[i], calldatas[i], proposal.eta);
        }
        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancel a queued proposal. This requires the proposer has not been executed yet.
     * @param targets Target contracts
     * @param values Calls' value
     * @param signatures Target functions' signature
     * @param calldatas Calldatas
     * @param descriptionHash IPFS hash of proposal's description
     */
    function cancel(address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas, bytes32 descriptionHash) external onlyAuthority {
        uint256 proposalId = hashProposal(targets, values, signatures, calldatas, descriptionHash);
        require(state(proposalId) != ProposalState.Executed, "Governor::cancel: cannot cancel executed proposal");
        require(state(proposalId) != ProposalState.Canceled, "Governor::cancel: cannot cancel canceled proposal"); 

        Proposal storage proposal = proposals[proposalId];
        
        proposal.canceled = true;
        for (uint256 i = 0; i < targets.length; i++) {
            timelock.cancelTransaction(targets[i], values[i], signatures[i], calldatas[i], proposal.eta);
        }

        emit ProposalCanceled(proposalId);
    }

    /**
     * @notice Perform emergency actions for protocol's stability & development. This requires guardian authority.
     * @param targets Target contracts
     * @param values Calls' value
     * @param signatures Target functions' signature
     * @param calldatas Calldatas
     * @param description Explaination for emergency actions
     */
    function emergencyCall(address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas, string memory description) external payable onlyAuthority {
        for (uint256 i = 0; i < targets.length; i++) {
            timelock.emergencyTransaction{value: values[i]}(targets[i], values[i], signatures[i], calldatas[i]);
        }

        emit EmergencyActions(msg.sender, targets, values, signatures, calldatas, description);
    }

    /**
     * @notice Cast vote for a proposal.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote (0 = Against, 1 = For, 2 = Abstain)
     */
    function castVote(uint256 proposalId, uint8 support) external {
        emit VoteCast(msg.sender, proposalId, support, _castVote(msg.sender, proposalId, support), "");
    }

    /**
     * @notice Cast vote for a proposal with reason.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote (0 = Against, 1 = For, 2 = Abstain)
     * @param reason The reason given for the vote by user
     */
    function castVoteWithReason(uint256 proposalId, uint8 support, string calldata reason) external  {
        emit VoteCast(msg.sender, proposalId, support, _castVote(msg.sender, proposalId, support), reason);
    }

    /**
     * @notice Cast vote for a proposal by signature.
     * @param proposalId The id of the proposal to vote on
     * @param support The support value for the vote (0 = Against, 1 = For, 2 = Abstain)
     * @param v v
     * @param r r
     * @param s s
     */
    function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) external {
        bytes32 domainSeparator = keccak256(abi.encode(DOMAIN_TYPEHASH, keccak256(bytes(name)), keccak256(bytes(version)), _getChainId(), address(this)));
        bytes32 structHash = keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, support));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "Governor::castVoteBySig: invalid signature");
        emit VoteCast(signatory, proposalId, support, _castVote(signatory, proposalId, support), "");
    }

    /* ========== VIEW FUNCTIONS ========== */

    /**
     * @notice Hash a proposal's parameters to get its ID.
     * @param targets Target contracts
     * @param values Calls' value
     * @param signatures Target functions' signature
     * @param calldatas Calldatas
     * @param descriptionHash IPFS hash of proposal's description
     */
    function hashProposal(address[] memory targets, uint256[] memory values, string[] memory signatures, bytes[] memory calldatas, bytes32 descriptionHash) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(targets, values, signatures, calldatas, descriptionHash)));
    }

    /**
      * @notice Gets the receipt for a voter on a given proposal.
      * @param proposalId The id of the proposal
      * @param voter The address of the voter
      * @return The voting receipt
      */
    function getReceipt(uint256 proposalId, address voter) external view returns (Receipt memory) {
        return proposals[proposalId].receipts[voter];
    }

    /**
      * @notice Gets the status of a proposal.
      * @param proposalId The id of the proposal
      * @return Proposal's status
      */
    function state(uint256 proposalId) public view returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.startBlock > 0, "GovernorDelegate::state: proposal not existed.");
        if (proposal.canceled) {
            return ProposalState.Canceled;
        } else if (block.number <= proposal.startBlock) {
            return ProposalState.Pending;
        } else if (block.number <= (proposal.startBlock + proposal.duration)) {
            return ProposalState.Active;
        } else if (proposal.forVotes <= proposal.againstVotes || proposal.forVotes < quorum(proposal.startBlock)) {
            return ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp >= (proposal.eta + timelock.gracePeriod())) {
            return ProposalState.Expired;
        } else {
            return ProposalState.Queued;
        }
    }

    function votingDelay() public view returns (uint256) {
        return config.votingDelay;
    }

    function votingPeriod() public view returns (uint256) {
        return config.votingPeriod;
    }

    function quorum(uint64 blockNumber) public view returns (uint256) {
        return gToken.getPastTotalSupply(blockNumber) * config.quorumNumerator / QUORUM_DENOMINATOR;
    }

    function validateConfig(GovernorConfig memory _config) public pure returns (bool) {
        require(_config.votingDelay >= _config.minVotingDelay || _config.votingDelay <= _config.maxVotingDelay, "Governor::votingDelay: out of range voting delay.");
        require(_config.votingPeriod >= _config.minVotingPeriod || _config.votingPeriod <= _config.maxVotingPeriod, "Governor::votingPeriod: out of range voting period.");
        require(_config.quorumNumerator <= QUORUM_DENOMINATOR, "Governor::quorum: out of range voting delay.");
        return true;
    }

    /**
     * @notice View function which returns if an account is whitelisted
     * @param account Account to check whitelist status of
     * @return If the account is whitelisted
     */
    function isWhitelistedProposer(address account) public view returns (bool) {
        return (whitelistProposerExpirations[account] > block.timestamp);
    }

    /**
     * @notice View function to get proposals info.
     * @param _ids Array of proposals' indexes
     * @return stores Encoded proposals data
     */
    function proposalsInfo(uint256[] calldata _ids) external view returns (bytes32[PROPOSAL_STORAGE_SIZE][] memory stores) {
        stores = new bytes32[PROPOSAL_STORAGE_SIZE][](_ids.length);
        for (uint256 i; i < stores.length; i++) {
            stores[i] = _loadProposal(_ids[i]);
        }
    }


    /* ========== ADMIN FUNCTIONS ========== */

    function updateConfig(GovernorConfig memory newConfig) external onlyAuthority {
        _updateConfig(newConfig);
    }

    /**
     * @notice Admin function for setting the whitelist expiration as a timestamp for an account. Whitelist status allows accounts to propose without meeting threshold
     * @param account Account address to set whitelist expiration for
     * @param expiration Expiration for account whitelist status as timestamp (if now < expiration, whitelisted)
     */
    function setWhitelistProposerExpiration(address account, uint256 expiration) external onlyAuthority {
        whitelistProposerExpirations[account] = expiration;

        emit WhitelistProposerExpirationSet(account, expiration);
    }

    /**
     * @notice Admin function for setting the guardian. guardian can cancel proposals from whitelisted addresses
     * @param newGuardian Account to set guardian to (0x0 to remove guardian)
     */
    function setGuardian(address newGuardian) external onlyAuthority {
        emit NewGuardianSet(guardian, newGuardian);
        guardian = newGuardian;
    }

    /**
     * @notice Set new voting strategy contract. Requires admin or guardian authority.
     * @param newTimelock New voting strategy contract's address
     */
    function setTimelock(address newTimelock) external onlyAuthority {
        require(newTimelock != address(0), "Governor::setTimelock: timelock can not be zero address.");
        timelock.setGovernor(address(0));
        emit NewTimelockSet(timelock, ITimelock(newTimelock));
        timelock = ITimelock(newTimelock);
    }

}