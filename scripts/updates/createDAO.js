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
        governorConfig: {
            // [1,100000,1,100000,1,1,1000,20,false]
            minVotingDelay: 1,
            maxVotingDelay: 100000,
            minVotingPeriod: 1,
            maxVotingPeriod: 100000,
            votingDelay: 3,
            votingPeriod: 10,
            quorumNumerator: 1000,
            proposalMaxOperations: 20,
            isWhitelistRequired: false
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
                        datas: {
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
    
    // // Create First DAO
    // utils.logDivider("DAAS DAO");

    // await contracts["daoFactory"].contract.createDAO(
    //     [deployer.address],
    //     config.governorConfig,
    //     config.timelockConfig,
    //     addresses.zeroAddress,
    //     config.standard,
    //     config.initialization,
    //     config.infoHash
    // );

    // const encodedData = await contracts["daoFactory"].contract.daosInfo([0]);
    // const firstDAO = decoders.daoList(encodedData)[0];
    // console.log("First DAO:", firstDAO);

    // contracts["governor"].contract = contracts["governor"].factory.attach(firstDAO.governor);
    // contracts["timelock"].contract = contracts["timelock"].factory.attach(await contracts["governor"].contract.timelock());
    // logContract("governor");
    // logContract("timelock");
    
    // switch (firstDAO.standard) {
    //     case config.standards["ERC20Votes"]:
    //         contracts["erc20votes"].contract = contracts["erc20votes"].factory.attach(await contracts["governor"].contract.gToken())
    //         logContract("erc20votes");
    //         break;
    //     case config.standards["ERC721Votes"]:
    //         contracts["erc721votes"].contract = contracts["erc721votes"].factory.attach(await contracts["governor"].contract.gToken())
    //         logContract("erc721votes");
    //         break;
    // }

    // Create DAOs
    utils.logDivider("DAAS DAO");

    const len = daoConfig(deployer).mock.length;
    for (let i = 0; i < len; i++) {
        await (async (e, i) => {
            let tx = await contracts["daoFactory"].contract.createDAO(
                [deployer.address],
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
            contracts["timelock"].contract = contracts["timelock"].factory.attach(await contracts["governor"].contract.timelock());
            logContract("governor");
            logContract("timelock");
            
            switch (dao.standard) {
                case config.standards["ERC20Votes"]:
                    contracts["erc20votes"].contract = contracts["erc20votes"].factory.attach(await contracts["governor"].contract.gToken())
                    logContract("erc20votes");
                    break;
                case config.standards["ERC721Votes"]:
                    contracts["erc721votes"].contract = contracts["erc721votes"].factory.attach(await contracts["governor"].contract.gToken())
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