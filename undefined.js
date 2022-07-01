export default {"":{"chainId":31337,"explorer":""},"daofactory":{"address":"","interface":["event DAOBlacklisted(uint256 id)","event DAOCreated(uint256 id, tuple(bytes32 infoHash, address proxyAdmin, address governor, uint8 standard, bool isRetired, bool isBlacklisted) dao)","event DAORetired(uint256 id)","event DAOUpdated(uint256 id, tuple(bytes32 infoHash, address proxyAdmin, address governor, uint8 standard, bool isRetired, bool isBlacklisted) updatedDao)","event Initialized(uint8 version)","event OwnerChanged(address prevOwner, address newOwner)","event ProxyCreated(address proxy, address implementation)","function blacklistDAO(uint256 _daoId) @29000000","function changeOwner(address newOwner) @29000000","function createDAO(address[] _founders, tuple(uint32 minVotingDelay, uint32 maxVotingDelay, uint32 minVotingPeriod, uint32 maxVotingPeriod, uint32 votingDelay, uint32 votingPeriod, uint32 quorumNumerator, uint8 proposalMaxOperations, bool isWhitelistRequired) _governorConfig, tuple(uint32 minTimelockDelay, uint32 maxTimelockDelay, uint32 delay, uint32 gracePeriod) _timelockConfig, address _gToken, uint8 _standard, tuple(string name, string symbol, address owner, uint8 decimals, uint256 initialSupply) _initialization, bytes32 _infoHash) payable returns (uint256) @29000000","function createProxy(address _implementation, address _admin, bytes _initializeData) payable returns (address proxy_) @29000000","function createProxyAdmin(address _owner) returns (address admin_) @29000000","function daos(uint256) view returns (bytes32 infoHash, address proxyAdmin, address governor, uint8 standard, bool isRetired, bool isBlacklisted) @29000000","function daosInfo(uint256[] _ids) view returns (bytes32[3][] stores) @29000000","function getDAOIds(bool blacklist) view returns (uint256[]) @29000000","function getTotalDAOs() view returns (uint256) @29000000","function initialize(address _governorLogic, address _timelockLogic, address _gTokenFactory, address _owner) @29000000","function isDAOBlacklisted(uint256 _daoId) view returns (bool) @29000000","function isDAOExisted(uint256 _daoId) view returns (bool) @29000000","function isDAORetired(uint256 _daoId) view returns (bool) @29000000","function retireDAO(uint256 _daoId) @29000000","function updateDAO(uint256 _daoId, tuple(bytes32 infoHash, address proxyAdmin, address governor, uint8 standard, bool isRetired, bool isBlacklisted) _updatedDAO) @29000000"]},"proxyadmin":{"address":"","interface":["event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)","function changeProxyAdmin(address proxy, address newAdmin) @29000000","function getProxyAdmin(address proxy) view returns (address) @29000000","function getProxyImplementation(address proxy) view returns (address) @29000000","function owner() view returns (address) @29000000","function renounceOwnership() @29000000","function transferOwnership(address newOwner) @29000000","function upgrade(address proxy, address implementation) @29000000","function upgradeAndCall(address proxy, address implementation, bytes data) payable @29000000"]},"governancetokenfactory":{"address":"","interface":["function createToken(uint8 _standard, tuple(string name, string symbol, address owner, uint8 decimals, uint256 initialSupply) _initialization, address _owner) returns (address gToken_) @29000000"]},"governor":{"address":"","interface":["event EmergencyActions(address guardian, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description)","event GovernorConfigUpdated(tuple(uint32 minVotingDelay, uint32 maxVotingDelay, uint32 minVotingPeriod, uint32 maxVotingPeriod, uint32 votingDelay, uint32 votingPeriod, uint32 quorumNumerator, uint8 proposalMaxOperations, bool isWhitelistRequired) prevConfig, tuple(uint32 minVotingDelay, uint32 maxVotingDelay, uint32 minVotingPeriod, uint32 maxVotingPeriod, uint32 votingDelay, uint32 votingPeriod, uint32 quorumNumerator, uint8 proposalMaxOperations, bool isWhitelistRequired) newConfig)","event Initialized(uint8 version)","event NewGuardianSet(address oldGuardian, address newGuardian)","event NewTimelockSet(address oldTimelock, address newTimelock)","event ProposalCanceled(uint256 proposalId)","event ProposalCreated(uint256 index, uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, bytes32 descriptionHash)","event ProposalExecuted(uint256 proposalId)","event ProposalQueued(uint256 proposalId, uint256 eta)","event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason)","event WhitelistProposerExpirationSet(address account, uint256 expirtation)","function BALLOT_TYPEHASH() view returns (bytes32) @29000000","function DOMAIN_TYPEHASH() view returns (bytes32) @29000000","function QUORUM_DENOMINATOR() view returns (uint256) @29000000","function cancel(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, bytes32 descriptionHash) @29000000","function castVote(uint256 proposalId, uint8 support) @29000000","function castVoteBySig(uint256 proposalId, uint8 support, uint8 v, bytes32 r, bytes32 s) @29000000","function castVoteWithReason(uint256 proposalId, uint8 support, string reason) @29000000","function config() view returns (uint32 minVotingDelay, uint32 maxVotingDelay, uint32 minVotingPeriod, uint32 maxVotingPeriod, uint32 votingDelay, uint32 votingPeriod, uint32 quorumNumerator, uint8 proposalMaxOperations, bool isWhitelistRequired) @29000000","function emergencyCall(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, string description) payable @29000000","function execute(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, bytes32 descriptionHash) payable @29000000","function founders(uint256) view returns (address) @29000000","function gToken() view returns (address) @29000000","function getReceipt(uint256 proposalId, address voter) view returns (tuple(uint128 votes, uint32 timestamp, uint8 support, bool hasVoted)) @29000000","function guardian() view returns (address) @29000000","function hashProposal(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, bytes32 descriptionHash) pure returns (uint256) @29000000","function infoHash() view returns (bytes32) @29000000","function initialize(address[] _founders, tuple(uint32 minVotingDelay, uint32 maxVotingDelay, uint32 minVotingPeriod, uint32 maxVotingPeriod, uint32 votingDelay, uint32 votingPeriod, uint32 quorumNumerator, uint8 proposalMaxOperations, bool isWhitelistRequired) _config, address _timelock, address _gToken) @29000000","function isWhitelistedProposer(address account) view returns (bool) @29000000","function name() view returns (string) @29000000","function proposalIds(uint256) view returns (uint256) @29000000","function proposals(uint256) view returns (uint256 id, uint128 forVotes, uint128 againstVotes, uint128 abstainVotes, uint64 startBlock, uint32 duration, uint32 eta, address proposer, bool canceled, bool executed) @29000000","function proposalsInfo(uint256[] _ids) view returns (bytes32[5][] stores) @29000000","function propose(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, bytes32 descriptionHash) returns (uint256) @29000000","function queue(address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, bytes32 descriptionHash) @29000000","function quorum(uint64 blockNumber) view returns (uint256) @29000000","function setGuardian(address newGuardian) @29000000","function setTimelock(address newTimelock) @29000000","function setWhitelistProposerExpiration(address account, uint256 expiration) @29000000","function state(uint256 proposalId) view returns (uint8) @29000000","function timelock() view returns (address) @29000000","function updateConfig(tuple(uint32 minVotingDelay, uint32 maxVotingDelay, uint32 minVotingPeriod, uint32 maxVotingPeriod, uint32 votingDelay, uint32 votingPeriod, uint32 quorumNumerator, uint8 proposalMaxOperations, bool isWhitelistRequired) newConfig) @29000000","function validateConfig(tuple(uint32 minVotingDelay, uint32 maxVotingDelay, uint32 minVotingPeriod, uint32 maxVotingPeriod, uint32 votingDelay, uint32 votingPeriod, uint32 quorumNumerator, uint8 proposalMaxOperations, bool isWhitelistRequired) _config) pure returns (bool) @29000000","function version() view returns (string) @29000000","function votingDelay() view returns (uint256) @29000000","function votingPeriod() view returns (uint256) @29000000","function whitelistProposerExpirations(address) view returns (uint256) @29000000"]},"timelock":{"address":"","interface":["event GovernorSet(address governor)","event Initialized(uint8 version)","event Migrated(address newTimelock)","event TimelockConfigUpdated(tuple(uint32 minTimelockDelay, uint32 maxTimelockDelay, uint32 delay, uint32 gracePeriod) newConfig)","event TransactionCancelled(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta)","event TransactionExecuted(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta)","event TransactionQueued(bytes32 indexed txHash, address indexed target, uint256 value, string signature, bytes data, uint256 eta)","function cancelTransaction(address _target, uint256 _value, string _signature, bytes _data, uint256 _eta) @29000000","function config() view returns (uint32 minTimelockDelay, uint32 maxTimelockDelay, uint32 delay, uint32 gracePeriod) @29000000","function delay() view returns (uint32) @29000000","function emergencyTransaction(address _target, uint256 _value, string _signature, bytes _data) payable returns (bytes) @29000000","function executeTransaction(address _target, uint256 _value, string _signature, bytes _data, uint256 _eta) payable returns (bytes) @29000000","function gracePeriod() view returns (uint32) @29000000","function initialize(tuple(uint32 minTimelockDelay, uint32 maxTimelockDelay, uint32 delay, uint32 gracePeriod) _config, address _governor) @29000000","function isDeprecated() view returns (bool) @29000000","function queueTransaction(address _target, uint256 _value, string _signature, bytes _data, uint256 _eta) returns (bytes32) @29000000","function queuedTransactions(bytes32) view returns (bool) @29000000","function setGovernor(address _governor) @29000000","function updateConfig(tuple(uint32 minTimelockDelay, uint32 maxTimelockDelay, uint32 delay, uint32 gracePeriod) _config) @29000000","function validateConfig(tuple(uint32 minTimelockDelay, uint32 maxTimelockDelay, uint32 delay, uint32 gracePeriod) _config) view returns (bool) @29000000"]},"erc20votes":{"address":"","interface":["constructor(tuple(string name, string symbol, address owner, uint8 decimals, uint256 initialSupply) _initialization)","event Approval(address indexed owner, address indexed spender, uint256 value)","event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)","event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)","event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)","event Transfer(address indexed from, address indexed to, uint256 value)","function DELEGATION_TYPEHASH() view returns (bytes32) @29000000","function allowance(address owner, address spender) view returns (uint256) @29000000","function approve(address spender, uint256 amount) returns (bool) @29000000","function balanceOf(address account) view returns (uint256) @29000000","function decimals() view returns (uint8) @29000000","function decreaseAllowance(address spender, uint256 subtractedValue) returns (bool) @29000000","function delegate(address delegatee) @29000000","function delegates(address account) view returns (address) @29000000","function getPastTotalSupply(uint256 blockNumber) view returns (uint256) @29000000","function getPastVotes(address account, uint256 blockNumber) view returns (uint256) @29000000","function getTotalSupply() view returns (uint256) @29000000","function getVotes(address account) view returns (uint256) @29000000","function increaseAllowance(address spender, uint256 addedValue) returns (bool) @29000000","function mint(address to, uint256 amount) @29000000","function name() view returns (string) @29000000","function owner() view returns (address) @29000000","function renounceOwnership() @29000000","function supportsInterface(bytes4 interfaceId) view returns (bool) @29000000","function symbol() view returns (string) @29000000","function totalSupply() view returns (uint256) @29000000","function transfer(address to, uint256 amount) returns (bool) @29000000","function transferFrom(address from, address to, uint256 amount) returns (bool) @29000000","function transferOwnership(address newOwner) @29000000"]},"erc721votes":{"address":"","interface":["constructor(tuple(string name, string symbol, address owner, uint8 decimals, uint256 initialSupply) _initialization)","event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)","event ApprovalForAll(address indexed owner, address indexed operator, bool approved)","event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate)","event DelegateVotesChanged(address indexed delegate, uint256 previousBalance, uint256 newBalance)","event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)","event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)","function DELEGATION_TYPEHASH() view returns (bytes32) @29000000","function approve(address to, uint256 tokenId) @29000000","function balanceOf(address owner) view returns (uint256) @29000000","function delegate(address delegatee) @29000000","function delegates(address account) view returns (address) @29000000","function getApproved(uint256 tokenId) view returns (address) @29000000","function getPastTotalSupply(uint256 blockNumber) view returns (uint256) @29000000","function getPastVotes(address account, uint256 blockNumber) view returns (uint256) @29000000","function getTotalSupply() view returns (uint256) @29000000","function getVotes(address account) view returns (uint256) @29000000","function isApprovedForAll(address owner, address operator) view returns (bool) @29000000","function mint(address to, uint256 tokenId) @29000000","function name() view returns (string) @29000000","function owner() view returns (address) @29000000","function ownerOf(uint256 tokenId) view returns (address) @29000000","function renounceOwnership() @29000000","function safeTransferFrom(address from, address to, uint256 tokenId) @29000000","function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) @29000000","function setApprovalForAll(address operator, bool approved) @29000000","function supportsInterface(bytes4 interfaceId) view returns (bool) @29000000","function symbol() view returns (string) @29000000","function tokenURI(uint256 tokenId) view returns (string) @29000000","function transferFrom(address from, address to, uint256 tokenId) @29000000","function transferOwnership(address newOwner) @29000000"]}}