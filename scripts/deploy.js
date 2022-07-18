const { ethers, network } = require("hardhat")
const utils = require('./utils');
const decoders = require('./utils/decoders');
const proposals = require('./utils/proposals');

async function main() {

    const [deployer, user0, user1, user2, user3, user4] = await ethers.getSigners();
    const signers = [deployer, user0, user1, user2, user3, user4];
    const users = [user0, user1, user2, user3, user4];

    utils.logDivider("SIGNERS");
    console.log("Deployer:", deployer.address);
    users.map(e => console.log("User:", e.address));

    const config = {
        standards: {
            "ERC20Votes": 0,
            "ERC721Votes": 1
        },
        standard: 1,
        baseConfig: {
            // [1,100000,1,100000]
            minVotingDelay: 1,
            maxVotingDelay: 100000,
            minVotingPeriod: 1,
            maxVotingPeriod: 100000,
            isWhitelistRequired: false
        },
        governorConfig: {
            // [3,10,1000,1000]
            votingDelay: 3,
            votingPeriod: 10,
            quorumAttendance: 1000,
            quorumApproval: 1000
        },
        timelockConfig: {
            // [1,100000,10,100]
            minTimelockDelay: 1,
            maxTimelockDelay: 100000,
            delay: 10,
            gracePeriod: 100
        },
        initialization: {
            // erc721: ["Test","TST",""]
            // erc20: ["Test","TST","",18,"1000000000000000000000000000"]
            name: 'Test',
            symbol: 'TST',
            owner: deployer.address,
            decimals: 18,
            initialSupply: ethers.utils.parseUnits("1.0", 27)
        },
        infoHash: "0x9187a778899475de505baf633ea472572afb760af5f4a20b25a7be6962dea099",
        proposals: [
            {
                shortDes: "Test proposal",
                txs: [
                    {
                        target: "",
                        value: 0,
                        signature: "",
                        data: {
                            types: [],
                            params: []
                        }
                    }
                ],
                ipfsHash: "QmY8joHxQ2abJGceFxhyGt5Kfv4zVEKFkeWqQxqxKizvHE"
            }
        ]
    }

    const addresses = {
        zeroAddress: '0x0000000000000000000000000000000000000000'
    }

    const contracts = {
        proxyFactory: {
            name: "ProxyFactory",
            factory: {},
            contract: {}
        },
        proxyAdmin: {
            name: "ProxyAdmin",
            factory: {},
            contract: {}
        },
        gTokenFactory: {
            name: "GovernanceTokenFactory",
            factory: {},
            contract: {}
        },
        daoFactory: {
            name: "DAOFactory",
            factory: {},
            contract: {}
        },
        governor: {
            name: "Governor",
            factory: {},
            contract: {}
        },
        timelock: {
            name: "Timelock",
            factory: {},
            contract: {}
        },
        erc20votes: {
            name: "ERC20Votes",
            factory: {},
            contract: {}
        },
        erc721votes: {
            name: "ERC721Votes",
            factory: {},
            contract: {}
        },
        mockGoverned: {
            name: "MockGoverned",
            factory: {},
            contract: {}
        }
    }

    const logContract = (key) => { console.log(contracts[key].name + ":", contracts[key].contract.address) }
    const getAddress = (key) => { return contracts[key].contract.address ?? zeroAddress }

    await Promise.all(Object.keys(contracts).map(async (key) => { contracts[key].factory = await ethers.getContractFactory(contracts[key].name); }));

    utils.logDivider("DEPLOY PROCESS");

    // Deploy ProxyFactory
    contracts["proxyFactory"].contract = await contracts["proxyFactory"].factory.deploy();
    await contracts["proxyFactory"].contract.deployed();
    logContract("proxyFactory")

    // Deploy ProxyAdmin
    preCalcAddress = await contracts["proxyFactory"].contract.callStatic.createProxyAdmin(deployer.address);
    await contracts["proxyFactory"].contract.createProxyAdmin(deployer.address);
    contracts["proxyAdmin"].contract = contracts["proxyAdmin"].factory.attach(preCalcAddress);
    logContract("proxyAdmin");

    // Deploy GovernanceTokenFactory
    contracts["gTokenFactory"].contract = await contracts["gTokenFactory"].factory.deploy();
    await contracts["gTokenFactory"].contract.deployed();

    preCalcAddress = await contracts["proxyFactory"].contract.callStatic.createProxy(getAddress("gTokenFactory"), await getAddress("proxyAdmin"), "0x");
    await contracts["proxyFactory"].contract.createProxy(getAddress("gTokenFactory"), getAddress("proxyAdmin"), "0x");
    contracts["gTokenFactory"].contract = contracts["gTokenFactory"].factory.attach(preCalcAddress);
    logContract("gTokenFactory");

    // Deploy Governor Implementation
    contracts["governor"].contract = await contracts["governor"].factory.deploy();
    await contracts["governor"].contract.deployed();
    logContract("governor");

    // Deploy Timelock Implementation
    contracts["timelock"].contract = await contracts["timelock"].factory.deploy();
    await contracts["timelock"].contract.deployed();
    logContract("timelock");

    // Deploy DAOFactory
    contracts["daoFactory"].contract = await contracts["daoFactory"].factory.deploy();
    await contracts["daoFactory"].contract.deployed();
        
    preCalcAddress = await contracts["proxyFactory"].contract.callStatic.createProxy(getAddress("daoFactory"), getAddress("proxyAdmin"), utils.encodeWithSignature(
        "initialize(address,address,address,address)",
        ["address", "address", "address", "address"],
        [getAddress("governor"), getAddress("timelock"), getAddress("gTokenFactory"), deployer.address]
    ));
    await contracts["proxyFactory"].contract.createProxy(getAddress("daoFactory"), getAddress("proxyAdmin"), utils.encodeWithSignature(
        "initialize(address,address,address,address)",
        ["address", "address", "address", "address"],
        [getAddress("governor"), getAddress("timelock"), getAddress("gTokenFactory"), deployer.address]
    ));
    contracts["daoFactory"].contract = contracts["daoFactory"].factory.attach(preCalcAddress);
    logContract("daoFactory");
    
    // Create First DAO
    utils.logDivider("DAAS DAO");

    await contracts["daoFactory"].contract.createDAO(
        [deployer.address],
        config.baseConfig,
        config.governorConfig,
        config.timelockConfig,
        addresses.zeroAddress,
        config.standard,
        config.initialization,
        config.infoHash
    );

    const encodedData = await contracts["daoFactory"].contract.daosInfo([0]);
    const firstDAO = decoders.daoList(encodedData)[0];
    console.log("First DAO:", firstDAO);

    contracts["governor"].contract = contracts["governor"].factory.attach(firstDAO.governor);
    contracts["timelock"].contract = contracts["timelock"].factory.attach(await contracts["governor"].contract.timelocks(0));
    logContract("governor");
    logContract("timelock");
    
    switch (firstDAO.standard) {
        case config.standards["ERC20Votes"]:
            contracts["erc20votes"].contract = contracts["erc20votes"].factory.attach(await contracts["governor"].contract.votes())
            logContract("erc20votes");
            break;
        case config.standards["ERC721Votes"]:
            contracts["erc721votes"].contract = contracts["erc721votes"].factory.attach(await contracts["governor"].contract.votes())
            logContract("erc721votes");
            break;
    }

   
    utils.logDivider("MOCK PROPOSALS & VOTING");

    // Prepare voting power
    const gToken = contracts[config.standard == 0 ? "erc20votes" : "erc721votes"].contract;
    let infos = await Promise.all([await Promise.all(signers.map(e => gToken.balanceOf(e.address))), await Promise.all(signers.map(e => gToken.getVotes(e.address)))]);
    infos[0].map((e, i) => console.log("User", i, "balance:", config.standard == 0 ? ethers.utils.formatUnits(e, 18) : e));
    infos[1].map((e, i) => console.log("User", i, "votes:", config.standard == 0 ? ethers.utils.formatUnits(e, 18) : e));
    console.log("Quorum attendance:", await contracts["governor"].contract.quorum(config.governorConfig.quorumAttendance, await utils.bn()-1));
    console.log("Quorum approval:", await contracts["governor"].contract.quorum(config.governorConfig.quorumApproval, await utils.bn()-1));

    // Deploy MockGoverned
    contracts["mockGoverned"].contract = await contracts["mockGoverned"].factory.deploy(getAddress("timelock"));
    await contracts["mockGoverned"].contract.deployed();
    logContract("mockGoverned");

    console.log("Before proposal value:", await contracts["mockGoverned"].contract.interestRate());

    const firstProposal = config.proposals[0]
    firstProposal.txs[0].target = getAddress("mockGoverned");
    firstProposal.txs[0].signature = "setInterestRate(uint256)";
    firstProposal.txs[0].data.types.push("uint256");
    firstProposal.txs[0].data.params.push(101);
    
    const proposal = proposals.prepareProposal(firstProposal);

    console.log("Delegates...");
    await gToken.connect(deployer).delegate(user0.address);

    console.log("Propose...");
    console.log(proposal.actions)
    await contracts["governor"].contract.propose(0, 0, proposal.actions, proposal.descriptionHash);
    console.log("First proposal:", decoders.proposalList(await contracts["governor"].contract.proposalsInfo([0])));

    await utils.mineBlocks(config.governorConfig.votingDelay);

    console.log("User vote", await gToken.getVotes(user0.address));
    await contracts["governor"].contract.connect(user0).castVote(await contracts["governor"].contract.proposalIds(0), 1);
    
    await utils.mineBlocks(config.governorConfig.votingPeriod);

    console.log("Queue...");
    await contracts["governor"].contract.queue(proposal.actions, proposal.descriptionHash);
    
    await utils.moveTimestamp(config.timelockConfig.delay);

    console.log("Execute...");
    await contracts["governor"].contract.execute(proposal.actions, proposal.descriptionHash);

    console.log("First proposal:", decoders.proposalList(await contracts["governor"].contract.proposalsInfo([0])));

    console.log("After proposal value:", await contracts["mockGoverned"].contract.interestRate());

    return {
        config,
        signers,
        addresses,
        contracts
    };
}

if (require.main === module) {
    main()
    .then(() => process.exit())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
  
module.exports = main;