const { ethers, network } = require("hardhat")

const daoConfig = require('../config/daos');

const utils = require('../utils');
const decoders = require('../utils/decoders');
const proposals = require('../utils/proposals');
const deployed = require('../config/contracts');

async function main() {

    const [deployer, user0, user1] = await ethers.getSigners();
    const signers = [deployer, user0, user1];
    const users = [user0, user1];

    utils.logDivider("SIGNERS");
    console.log("Deployer:", deployer.address);
    users.map(e => console.log("User:", e.address));

    const config = {
        standards: {
            "ERC20Votes": 0,
            "ERC721Votes": 1
        },
        standard: 0,
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
        governanceTokenFactory: {
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
        // mockGoverned: {
        //     name: "MockGoverned",
        //     factory: {},
        //     contract: {}
        // }
    }

    const logContract = (key) => { console.log(contracts[key].name + ":", contracts[key].contract.address) }
    const getAddress = (key) => { return contracts[key].contract.address ?? zeroAddress }

    await Promise.all(Object.keys(contracts).map(async (key) => { contracts[key].factory = await ethers.getContractFactory(contracts[key].name); }));
    
    await Promise.all(Object.keys(deployed[network.name]).map(async (key) => { contracts[key].contract = await contracts[key].factory.attach(deployed[network.name][key]);}))
    
    // Create DAOs
    utils.logDivider("DAAS DAO");

    const len = daoConfig(deployer)[network.name].length;
    for (let i = 0; i < 1; i++) {
        await (async (e, i) => {
            let tx = await contracts["daoFactory"].contract.createDAO(
                [deployer.address],
                e.baseConfig,
                e.governorConfig,
                e.timelockConfig,
                addresses.zeroAddress,
                e.standard,
                e.initialization,
                proposals.getDescriptionHash(e.infoHash)
            );
            await tx.wait();

            let encodedData = await contracts["daoFactory"].contract.daosInfo([i]);
            let dao = decoders.daoList(encodedData)[0];
            console.log(`DAO ${i+1}:`, dao);

            contracts["governor"].contract = contracts["governor"].factory.attach(dao.governor);
            contracts["timelock"].contract = contracts["timelock"].factory.attach(await contracts["governor"].contract.timelocks(0));
            logContract("governor");
            logContract("timelock");
            
            switch (dao.standard) {
                case config.standards["ERC20Votes"]:
                    contracts["erc20votes"].contract = contracts["erc20votes"].factory.attach(await contracts["governor"].contract.votes())
                    logContract("erc20votes");
                    break;
                case config.standards["ERC721Votes"]:
                    contracts["erc721votes"].contract = contracts["erc721votes"].factory.attach(await contracts["governor"].contract.votes())
                    logContract("erc721votes");
                    break;
            }

            utils.logDivider('');
        })(daoConfig(deployer).mock[i], i);
    }

    

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