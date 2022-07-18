const { ethers, network } = require("hardhat")

const daoConfig = require('../config/daos');

const utils = require('../utils');
const decoders = require('../utils/decoders');
const proposals = require('../utils/proposals');

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

    const deployed = {
        proxyFactory: '0x2B2f78c5BF6D9C12Ee1225D5F374aa91204580c3',
        proxyAdmin: '0x756418B817E934f73Aa434DFaD4a686f836AA71d',
        gTokenFactory: '0x47C446F02e41006a05735a7d5e0666e5055b44df',
        daoFactory: '0x74311A7F293122487Dc57a9FffC552af67c5B0b7'
    }

    const logContract = (key) => { console.log(contracts[key].name + ":", contracts[key].contract.address) }
    const getAddress = (key) => { return contracts[key].contract.address ?? zeroAddress }

    await Promise.all(Object.keys(contracts).map(async (key) => { contracts[key].factory = await ethers.getContractFactory(contracts[key].name); }));

    await Promise.all(Object.keys(deployed).map(async (key) => { contracts[key].contract = await contracts[key].factory.attach(deployed[key]) }))

    utils.logDivider("MINT GTOKEN");

    await Promise.all(daoConfig(deployer).mock.map(async (e, i) => {
        let gToken;
        console.log(`DAO ${i+1}:`);
        contracts["governor"].contract = contracts["governor"].factory.attach(e.deployed.governor);
        logContract('governor');
        switch (e.standard) {
            case config.standards["ERC20Votes"]:
                contracts["erc20votes"].contract = contracts["erc20votes"].factory.attach(e.deployed.gToken)
                logContract("erc20votes");
                await Promise.all(users.map(async (user, index) => {
                    let tx = await contracts["erc20votes"].contract.connect(user)["mint(uint256)"](ethers.utils.parseUnits("1", 23))
                    await tx.wait();
                    console.log(`User${index} minted ${ethers.utils.parseUnits("1", 23-18)} ERC20Votes!`)
                }))
                break;
            case config.standards["ERC721Votes"]:
                contracts["erc721votes"].contract = contracts["erc721votes"].factory.attach(e.deployed.gToken)
                logContract("erc721votes");
                await Promise.all(users.map(async (user, index) => {
                    let tx = await contracts["erc721votes"].contract.connect(user)["mint(uint256)"](index+1)
                    await tx.wait();
                    console.log(`User${index} minted 1 ERC721Votes!`)
                }))
                break;
        }

        utils.logDivider('');
    }));

    

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