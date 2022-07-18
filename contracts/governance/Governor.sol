// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '../interfaces/IGovernor.sol';
import '../interfaces/ITimelock.sol';
import '../interfaces/IVotes.sol';
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';

contract Governor is Initializable, IGovernor {

    // The EIP-712 typehash for the contract's domain
    bytes32 public constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    // The EIP-712 typehash for the ballot struct used by the contract
    bytes32 public constant BALLOT_TYPEHASH = keccak256("Ballot(uint256 proposalId,uint8 support)");

    // Used to read proposals data
    uint256 internal constant PROPOSAL_STORAGE_SIZE = 5;

    // Denominator for quorum calculation
    uint256 public constant QUORUM_DENOMINATOR = 100000;

    /// @notice The name of this contract
    string public name;

    /// @notice The version of this contract
    string public version;

    /// @notice Admin accounts
    address[] public admins;

    /// @notice Base configuration
    GovernorBaseConfig public baseConfig;

    /// @notice 
    GovernorConfig[] public configs;

    // The address of the Timelock contract.
    ITimelock[] public timelocks;

    // The address of the Votes contract.
    IVotes public votes;

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

    modifier onlyAuthority() {
        require(msg.sender == address(timelocks[0]) || msg.sender == guardian, "Governor: call must come from timelock or guardian.");
        _;
    }

    /* ========== FUNCTIONS ========== */

    /**
      * @notice Used as constructor of Governor contract
      * @param _admins Addresses of organization's admins
      * @param _baseConfig The initial base configuration
      * @param _config The default configuration
      * @param _timelock The address of the Timelock contract
      * @param _votes The address of the Governance Token contract
      */
    function initialize(address[] memory _admins, GovernorBaseConfig memory _baseConfig, GovernorConfig memory _config, address _timelock, address _votes) public initializer {
        require(_timelock != address(0), "Governor::initialize: timelock must not be address");
        require(_votes != address(0), "Governor::initialize: governance token must not be address");

        admins = _admins;
        baseConfig = _baseConfig;
        _addConfig(_config);
        _updateTimelocks(_timelock, true);
        votes = IVotes(_votes);
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
    function _queueOrRevert(ITimelock timelock, address target, uint256 value, string memory signature, bytes memory data, uint256 eta) internal {
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
        uint128 votes = uint128(votes.getPastVotes(voter, proposal.startBlock));
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

    function _isAdmin(address _admin) internal view returns (bool, uint256){
        address[] memory _admins = admins;
        for (uint256 i=admins.length; i > 0; ) {
            if (_admins[i-1] == _admin) return (true, i-1);
            unchecked { --i; }
        }
        return (false, 0);
    }

    function _isTimelock(address _timelock) internal view returns (bool, uint256) {
        ITimelock[] memory _timelocks = timelocks;
        for (uint256 i=timelocks.length; i > 0; ) {
            if (address(_timelocks[i-1]) == _timelock) return (true, i-1);
            unchecked { --i; }
        }
        return (false, 0);
    }

    function _updateAdmins(address _admin, bool _isAdd) internal {
        require(_admin != address(0), "Governor::addAdmin: admin can not be zero address");
        (bool isExisted, uint256 index) = _isAdmin(_admin);
        if (_isAdd) {
            require(!isExisted, "Governor::addAdmin: admin already existed");
            admins.push(_admin);
        } else {
            require(isExisted, "Governor::removeAdmin: admin not existed");
            admins[index] = admins[admins.length-1];
            admins.pop();
        }
        emit AdminsUpdated(admins);
    }

    function _updateTimelocks(address _timelock, bool _isAdd) internal {
        require(_timelock != address(0), "Governor::addTimelock: timelock can not be zero address");
        (bool isExisted, uint256 index) = _isTimelock(_timelock);
        if (_isAdd) {
            require(!isExisted, "Governor::addTimelock: timelock already existed");
            timelocks.push(ITimelock(_timelock));
        } else {
            require(isExisted, "Governor::removeTImelock: timelock not existed");
            require(index != 0, "Governor::removeTimelock: can not remove root timelock");
            timelocks[index] = timelocks[timelocks.length-1];
            timelocks.pop();
        }
        emit TimelocksUpdated(timelocks);
    }

    function _updateConfig(uint index, GovernorConfig memory newConfig) internal {
        validateConfig(newConfig);
        require(index < configs.length, "Governor::_updateConfigs: index out of range configs.");
        configs[index] = newConfig;
        emit GovernorConfigsUpdated(configs);
    }

    function _addConfig(GovernorConfig memory newConfig) internal {
        validateConfig(newConfig);
        configs.push(newConfig);
        emit GovernorConfigsUpdated(configs);
    }

    function _removeConfig(uint index) internal {
        require(index < configs.length, "Governor::_updateConfigs: index out of range configs.");
        configs[index] = configs[configs.length-1];
        configs.pop();
        emit GovernorConfigsUpdated(configs);
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
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     * @return Proposal's index
     */
    function propose(uint256 _timelock, uint256 _config, Action[] memory actions, bytes32 descriptionHash) external returns (uint256) {
        require(!baseConfig.isWhitelistRequired || isWhitelistedProposer(msg.sender), "Governor::propose: proposer needs to be whitelisted");
        
        uint256 proposalId = hashProposal(actions, descriptionHash);
        Proposal storage newProposal = proposals[proposalId];

        require(newProposal.startBlock == 0, "Governor::propose: proposal already existed");

        GovernorConfig memory config = configs[_config];
        uint64 startBlock = uint64(block.number + config.votingDelay);
        uint32 duration = config.votingPeriod;

        newProposal.id = hashProposal(actions, descriptionHash);
        newProposal.proposer = msg.sender;
        newProposal.eta = 0;
        newProposal.startBlock = startBlock;
        newProposal.duration = duration;
        newProposal.forVotes = 0;
        newProposal.againstVotes = 0;
        newProposal.abstainVotes = 0;
        newProposal.quorumAttendance = config.quorumAttendance;
        newProposal.quorumApproval = config.quorumApproval;
        newProposal.canceled = false;
        newProposal.executed = false;
        newProposal.timelock = timelocks[_timelock];

        proposalIds[proposalCount] = proposalId;

        emit ProposalCreated(
            proposalCount,
            proposalId,
            msg.sender,
            address(timelocks[_timelock]),
            actions,
            startBlock,
            startBlock+duration,
            descriptionHash
        );

        ++proposalCount;
        return proposalCount;
    }
    
    /**
     * @notice Queue a succeeded proposal. This requires the quorum to be reached, the vote to be successful, and the voting period has ended.
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */
    function queue(Action[] memory actions, bytes32 descriptionHash) external {
        uint256 proposalId = hashProposal(actions, descriptionHash);
        require(state(proposalId) == ProposalState.Succeeded, "Governor::queue: proposal can only be queued if it is succeeded");

        Proposal storage proposal = proposals[proposalId];
        uint32 eta = uint32(block.timestamp + proposal.timelock.delay());

        for (uint256 i = 0; i < actions.length; i++) {
            _queueOrRevert(proposal.timelock, actions[i].target, actions[i].value, actions[i].signature, actions[i].data, eta);
        }
        proposal.eta = eta;
        
        emit ProposalQueued(proposalId, eta);
    }

    /**
     * @notice Execute a succeeded proposal. This requires the quorum to be reached, the vote to be successful, and the timelock delay period has passed.
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */
    function execute(Action[] memory actions, bytes32 descriptionHash) external payable {
        uint256 proposalId = hashProposal(actions, descriptionHash);
        require(state(proposalId) == ProposalState.Queued, "Governor::execute: proposal can only be executed if it is queued");

        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;

        for (uint256 i = 0; i < actions.length; i++) {
            proposal.timelock.executeTransaction{value: actions[i].value}(actions[i].target, actions[i].value, actions[i].signature, actions[i].data, proposal.eta);
        }

        emit ProposalExecuted(proposalId);
    }

    /**
     * @notice Cancel a queued proposal. This requires the proposer has not been executed yet.
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */
    function cancel(Action[] memory actions, bytes32 descriptionHash) external onlyAuthority {
        uint256 proposalId = hashProposal(actions, descriptionHash);
        require(state(proposalId) != ProposalState.Executed, "Governor::cancel: cannot cancel executed proposal");
        require(state(proposalId) != ProposalState.Canceled, "Governor::cancel: cannot cancel canceled proposal"); 

        Proposal storage proposal = proposals[proposalId];
        
        proposal.canceled = true;
        for (uint256 i = 0; i < actions.length; i++) {
            proposal.timelock.cancelTransaction(actions[i].target, actions[i].value, actions[i].signature, actions[i].data, proposal.eta);
        }

        emit ProposalCanceled(proposalId);
    }

    /**
     * @notice Perform emergency actions for protocol's stability & development. This requires guardian authority.
     * @param actions Proposal's actions
     * @param description Explaination for emergency actions
     */
    function emergencyCall(uint256 timelock, Action[] memory actions, string memory description) external payable onlyAuthority {
        ITimelock _timelock = timelocks[timelock];
        for (uint256 i = 0; i < actions.length; i++) {
            ITimelock(_timelock).emergencyTransaction{value: actions[i].value}(actions[i].target, actions[i].value, actions[i].signature, actions[i].data);
        }

        emit EmergencyActions(msg.sender, address(_timelock), actions, description);
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
     * @param actions Proposal's actions
     * @param descriptionHash IPFS hash of proposal's description
     */
    function hashProposal(Action[] memory actions, bytes32 descriptionHash) public pure returns (uint256) {
        return uint256(keccak256(abi.encode(actions, descriptionHash)));
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
        } else if (proposal.forVotes <= proposal.againstVotes 
                || proposal.forVotes < quorum(proposal.quorumApproval, proposal.startBlock)
                || (proposal.forVotes + proposal.againstVotes + proposal.abstainVotes) <= quorum(proposal.quorumAttendance, proposal.startBlock)) {
            return ProposalState.Defeated;
        } else if (proposal.eta == 0) {
            return ProposalState.Succeeded;
        } else if (proposal.executed) {
            return ProposalState.Executed;
        } else if (block.timestamp >= (proposal.eta + proposal.timelock.gracePeriod())) {
            return ProposalState.Expired;
        } else {
            return ProposalState.Queued;
        }
    }

    function quorum(uint256 nominator, uint64 blockNumber) public view returns (uint256) {
        return votes.getPastTotalSupply(blockNumber) * nominator / QUORUM_DENOMINATOR;
    }

    function validateConfig(GovernorConfig memory _config) public view {
        require(_config.votingDelay >= baseConfig.minVotingDelay && _config.votingDelay <= baseConfig.maxVotingDelay, "Governor::votingDelay: out of range voting delay.");
        require(_config.votingPeriod >= baseConfig.minVotingPeriod && _config.votingPeriod <= baseConfig.maxVotingPeriod, "Governor::votingPeriod: out of range voting period.");
        require(_config.quorumAttendance <= QUORUM_DENOMINATOR, "Governor::quorum: out of range quorum attendance.");
        require(_config.quorumApproval <= QUORUM_DENOMINATOR, "Governor::quorum: out of range quorum approval.");
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

    function getConfigs() external view returns (GovernorConfig[] memory) {
        return configs;
    }

    function getTimelocks() external view returns (ITimelock[] memory) {
        return timelocks;
    }

    /* ========== ADMIN FUNCTIONS ========== */

    /**
     * @notice Admin function for setting the guardian. guardian can cancel proposals from whitelisted addresses
     * @param newGuardian Account to set guardian to (0x0 to remove guardian)
     */
    function setGuardian(address newGuardian) external onlyAuthority {
        emit NewGuardianSet(guardian, newGuardian);
        guardian = newGuardian;
    }

    function addAdmin(address _admin) external onlyAuthority {
        _updateAdmins(_admin, true);
    }

    function removeAdmin(address _admin) external onlyAuthority {
        _updateAdmins(_admin, false);
    }

    function addTimelock(address _timelock) external onlyAuthority {
        _updateTimelocks(_timelock, true);
    }

    function removeTimelock(address _timelock) external onlyAuthority {
        _updateTimelocks(_timelock, false);
    }

    function updateConfig(uint256 index, GovernorConfig memory newConfig) external onlyAuthority {
        _updateConfig(index, newConfig);
    }

    function addConfig(GovernorConfig memory _config) external onlyAuthority {
        _addConfig(_config);
    }

    function removeConfig(uint256 _index) external onlyAuthority {
        _removeConfig(_index);
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

}