const { ethers } = require('hardhat')

const daos = (deployer) => {
    return {
        mock: [
            {
                deployed: {
                    proxyAdmin: '0xad8cfccd81757132e53e17b1f4d49dcb83c3a328',
                    governor: '0x1ba86341207f9d3aceda6ba72a1a7e97d4f8d743',
                    timelock: '0xBf8E59F491D1e8D4d2C88b5666848d0C07d95DA2',
                    gToken: '0x6C5F6c9Eee26D84198898B06d14efBeE51134C6C',
                    mockGoverned: '0x466C2C8c3d3aF0c55cf80146fAB394953215b2AC'
                },
                standard: 0,
                baseConfig: {
                    minVotingDelay: 1,
                    maxVotingDelay: 100000,
                    minVotingPeriod: 1,
                    maxVotingPeriod: 100000,
                    isWhitelistRequired: false
                },
                governorConfig: {
                    votingDelay: 3,
                    votingPeriod: 100,
                    quorumAttendance: 1000,
                    quorumApproval: 1000
                },
                timelockConfig: {
                    minTimelockDelay: 1,
                    maxTimelockDelay: 100000,
                    delay: 10,
                    gracePeriod: 100
                },
                initialization: {
                    name: 'AVEE',
                    symbol: 'AVE',
                    owner: deployer.address,
                    decimals: 18,
                    initialSupply: ethers.utils.parseUnits("1.0", 27)
                },
                infoHash: 'QmUrD5X5zKnf7vQJjNmB7AmsHcAVj67yfzav4PLrfwzQgh'
            },
            {
                deployed: {
                    proxyAdmin: '0x5046b11c1ab9dde7eeb3ef655396b5b58d56aeca',
                    governor: '0xa370d0fa4f60eb4565c5fb3f0d3d4223e0f4e912',
                    timelock: '0x5f113007808216355A15240Ba65a65Eb77152711',
                    gToken: '0x3A885870fA40aA22Eba467243fD58B1dfF5386e6',
                    mockGoverned: '0x26B23E0feBe16d801D852b6cEF10232ee83762FD'
                },
                standard: 0,
                baseConfig: {
                    minVotingDelay: 1,
                    maxVotingDelay: 100000,
                    minVotingPeriod: 1,
                    maxVotingPeriod: 100000,
                    isWhitelistRequired: false
                },
                governorConfig: {
                    votingDelay: 5,
                    votingPeriod: 150,
                    quorumAttendance: 1000,
                    quorumApproval: 1000
                },
                timelockConfig: {
                    minTimelockDelay: 1,
                    maxTimelockDelay: 100000,
                    delay: 12,
                    gracePeriod: 100
                },
                initialization: {
                    name: 'CUV',
                    symbol: 'CUV',
                    owner: deployer.address,
                    decimals: 18,
                    initialSupply: ethers.utils.parseUnits("1.0", 27)
                },
                infoHash: 'QmeMDxZaiPUuFyqXrSCkY8DEm3fft8c5cTbjTeG3j3cxm5'
            },
            {
                deployed: {
                    proxyAdmin: '0x6974be72aefcd2270eb3ef5e8edfba89afab699e',
                    governor: '0x28615efb3430570e2979f2206184a8dfd9c1dda3',
                    timelock: '0x8C4B62D1f32356942667B840951DA590754fF479',
                    gToken: '0x3e6434CF23FA7cA53910D0c060ef56143e10C271',
                    mockGoverned: '0xB752C7e5fe53CDEAf26945AAC16BECd4D03453b1'
                },
                standard: 1,
                baseConfig: {
                    minVotingDelay: 1,
                    maxVotingDelay: 100000,
                    minVotingPeriod: 1,
                    maxVotingPeriod: 100000,
                    isWhitelistRequired: false
                },
                governorConfig: {
                    votingDelay: 2,
                    votingPeriod: 120,
                    quorumAttendance: 1000,
                    quorumApproval: 1000
                },
                timelockConfig: {
                    minTimelockDelay: 1,
                    maxTimelockDelay: 100000,
                    delay: 9,
                    gracePeriod: 100
                },
                initialization: {
                    name: 'UNC',
                    symbol: 'UNC',
                    owner: deployer.address,
                    decimals: 18,
                    initialSupply: ethers.utils.parseUnits("1.0", 27)
                },
                infoHash: 'QmZskAJu484DK9zCCekrLPdPRBAAUEQtRvVRiHsGvUXzqd'
            },
            {
                deployed: {
                    proxyAdmin: '0xf17e00a7fb187de2ea66ed5d78a9db6e3e30ed09',
                    governor: '0x89ad922df251845ee59fbac4f5d9995c5cc9c1e9',
                    timelock: '0x5fbE2caf714e25b7F97D115f784Ec262Ee643f1D',
                    gToken: '0x4223117173f026F6586281F985545777435C3B56',
                    mockGoverned: '0xbd70d9A8E1A651B6829C21B1a76aFE609Ce50c36'
                },
                standard: 0,
                baseConfig: {
                    minVotingDelay: 1,
                    maxVotingDelay: 100000,
                    minVotingPeriod: 1,
                    maxVotingPeriod: 100000,
                    isWhitelistRequired: false
                },
                governorConfig: {
                    votingDelay: 1,
                    votingPeriod: 80,
                    quorumAttendance: 1000,
                    quorumApproval: 1000
                },
                timelockConfig: {
                    minTimelockDelay: 1,
                    maxTimelockDelay: 100000,
                    delay: 10,
                    gracePeriod: 100
                },
                initialization: {
                    name: 'MEK',
                    symbol: 'MEK',
                    owner: deployer.address,
                    decimals: 18,
                    initialSupply: ethers.utils.parseUnits("1.0", 27)
                },
                infoHash: 'QmfHnRwmyLmTwJd1xrjuaAACp25Udhwiu31vwcJ9eP1XCU'
            },
            {
                deployed: {
                    proxyAdmin: '0x35b97c0d9fdca477f8fcb15810a01b2ff6771a79',
                    governor: '0x0a83a5147bb30feb3d7c76023bcccf50a4bbdbee',
                    timelock: '0x8744Cd73545ACd3eCe5d04C41bE011fea7fD3f43',
                    gToken: '0x189EaC9e0a10be9Fa0257c63892E7AFa8F6cb8b3',
                    mockGoverned: '0x98D669278F61BCC6a5c6c36b2F47b749364beA07'
                },
                standard: 1,
                baseConfig: {
                    minVotingDelay: 1,
                    maxVotingDelay: 100000,
                    minVotingPeriod: 1,
                    maxVotingPeriod: 100000,
                    isWhitelistRequired: false
                },
                governorConfig: {
                    votingDelay: 5,
                    votingPeriod: 100,
                    quorumAttendance: 1000,
                    quorumApproval: 1000
                },
                timelockConfig: {
                    minTimelockDelay: 1,
                    maxTimelockDelay: 100000,
                    delay: 11,
                    gracePeriod: 100
                },
                initialization: {
                    name: 'CMPO',
                    symbol: 'CMPO',
                    owner: deployer.address,
                    decimals: 18,
                    initialSupply: ethers.utils.parseUnits("1.0", 27)
                },
                infoHash: 'QmbyBUXsG5NZxzsV2tQMTs735L6qu3NDqU3VJXvaM3Y9Js'
            },
            {
                deployed: {
                    proxyAdmin: '0x4fb1d6100a96a13a65aeae00c5c95bdc46e7398e',
                    governor: '0x7ff94876cf452f0e9094cc9d12466c4cb9930b92',
                    timelock: '0xfcE02Ba02e807Ed55Ad4170e377783e24A0dC275',
                    gToken: '0x85b039fb2867FCB585583D6174cB849D6FBbEa96',
                    mockGoverned: '0x24C17bf9Af7A0e372D8B3571dBa12C216Bc44E42'
                },
                standard: 0,
                baseConfig: {
                    minVotingDelay: 1,
                    maxVotingDelay: 100000,
                    minVotingPeriod: 1,
                    maxVotingPeriod: 100000,
                    isWhitelistRequired: false
                },
                governorConfig: {
                    votingDelay: 10,
                    votingPeriod: 300,
                    quorumAttendance: 1000,
                    quorumApproval: 1000
                },
                timelockConfig: {
                    minTimelockDelay: 1,
                    maxTimelockDelay: 100000,
                    delay: 20,
                    gracePeriod: 100
                },
                initialization: {
                    name: 'PEN',
                    symbol: 'PEN',
                    owner: deployer.address,
                    decimals: 18,
                    initialSupply: ethers.utils.parseUnits("1.0", 27)
                },
                infoHash: 'QmYsx56RqnLQQ6fpLp57vR94u1E3NDZ8afqQ4QDxKv4oZp'
            },
        ],
        testnetbsc: [
    
        ]
    }
}


module.exports = daos