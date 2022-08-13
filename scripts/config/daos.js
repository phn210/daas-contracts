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
                infoHash: 'QmQ1XSSrSirhS2nAjBqL5wzBEv1kjU2ckU5ZnyM6PygCvr'
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
                infoHash: 'QmbgvCSGxw6r59LYYWQj6z1CUZU6ZHfwVseeeUKfSoH9mw'
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
                infoHash: 'QmYLtxKJEURJ7KoGeqmT1wyERLCHtH4gdr7bSJRYa537Ub'
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
                infoHash: 'QmUTa5p9ukfnXAvEraK7GczcdZnJKix4dLm9KwWTsn2xBt'
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
                infoHash: 'QmQ3kFbqz1rhe6Ym9CMCNPmsfA64uh1qtrir5MfM541VQU'
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
                infoHash: 'QmbACp2vABBpRu9h1r8zwMyEhT9UgZm2iDYhRGKVBAu7VQ'
            },
        ],
        localhost: [
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmQ1XSSrSirhS2nAjBqL5wzBEv1kjU2ckU5ZnyM6PygCvr'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmbgvCSGxw6r59LYYWQj6z1CUZU6ZHfwVseeeUKfSoH9mw'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmYLtxKJEURJ7KoGeqmT1wyERLCHtH4gdr7bSJRYa537Ub'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmUTa5p9ukfnXAvEraK7GczcdZnJKix4dLm9KwWTsn2xBt'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmQ3kFbqz1rhe6Ym9CMCNPmsfA64uh1qtrir5MfM541VQU'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmbACp2vABBpRu9h1r8zwMyEhT9UgZm2iDYhRGKVBAu7VQ'
            },
        ],
        testnetbsc: [
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '0x24D352300634fE9A7e749330168e7996C7f37C81',
                    timelock: '',
                    gToken: '0xC0f5A2576dAd2723ac4D3Fb5c12C7fBC1F22ACAB',
                    mockGoverned: ''
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
                infoHash: 'QmQ1XSSrSirhS2nAjBqL5wzBEv1kjU2ckU5ZnyM6PygCvr'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '0x59dADdb16F1C4AD5092B89552eAd764106Ecf003',
                    timelock: '',
                    gToken: '0x873D3610B5972f8d10c63080157eC20d09BAEa67',
                    mockGoverned: ''
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
                infoHash: 'QmbgvCSGxw6r59LYYWQj6z1CUZU6ZHfwVseeeUKfSoH9mw'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '0x1DD76Ed9F4956C0A9e1c77779A18BBB626978b0e',
                    timelock: '',
                    gToken: '0x6Bee71539922FFd9345000Efffc143775c05C4fe',
                    mockGoverned: ''
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
                infoHash: 'QmYLtxKJEURJ7KoGeqmT1wyERLCHtH4gdr7bSJRYa537Ub'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '0x2Ef6DbFD41CD78C796B782a830BCB4c8A90bbC2A',
                    timelock: '',
                    gToken: '0x753524028F105541f856598dA52e6f6fa50fEBDf',
                    mockGoverned: ''
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
                infoHash: 'QmQ1XSSrSirhS2nAjBqL5wzBEv1kjU2ckU5ZnyM6PygCvr'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '0x993B68F21a7B790D70E46d2112Ac590591416ACb',
                    timelock: '',
                    gToken: '0xcE9Df7B4F7522dFca356397796C9C6967142B0B2',
                    mockGoverned: ''
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
                infoHash: 'QmbgvCSGxw6r59LYYWQj6z1CUZU6ZHfwVseeeUKfSoH9mw'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '0xB2Ca08bB484494b0ad6Afa9d231be75CaEe357d9',
                    timelock: '',
                    gToken: '0xa78113316cFE8C07AB65Ce5b6D2e2d83128aB600',
                    mockGoverned: ''
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
                infoHash: 'QmYLtxKJEURJ7KoGeqmT1wyERLCHtH4gdr7bSJRYa537Ub'
            },
        ],
        rinkeby: [
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmUTa5p9ukfnXAvEraK7GczcdZnJKix4dLm9KwWTsn2xBt'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmQ3kFbqz1rhe6Ym9CMCNPmsfA64uh1qtrir5MfM541VQU'
            },
            {
                deployed: {
                    proxyAdmin: '',
                    governor: '',
                    timelock: '',
                    gToken: '',
                    mockGoverned: ''
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
                infoHash: 'QmbACp2vABBpRu9h1r8zwMyEhT9UgZm2iDYhRGKVBAu7VQ'
            },
        ]
    }
}


module.exports = daos