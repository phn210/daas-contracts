const { ethers, network } = require("hardhat")

async function main() {

    const [deployer, user0, user1, user2, user3, user4] = await ethers.getSigner();
    const signers = [deployer, user0, user1, user2, user3, user4];

    const config = {
        governorConfig: {
            // [1,100000,1,100000,1,1,1000,20,false]
            minVotingDelay: 1,
            maxVotingDelay: 100000,
            minVotingPeriod: 1,
            maxVotingPeriod: 100000,
            votingDelay: 1,
            votingPeriod: 1,
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
            // erc20: ["Test","TST",""]
            // erc721: ["Test","TST","",18,"1000000000000000000000000000"]
            name: 'Test',
            symbol: 'TST',
            owner: deployer.address,
            decimals: 18,
            initialSupply: 1000000000000000000000000000,
            infoHash: "0x9187a778899475de505baf633ea472572afb760af5f4a20b25a7be6962dea099"
        }
    }
    const addresses = {
        zeroAddress: '0x0000000000000000000000000000000000000000'
    }

    return {
        config,
        signers,
        addresses
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