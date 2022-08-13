const contracts = {
    hardhat: {
        proxyFactory: "",
        proxyAdmin: "",
        governanceTokenFactory: "",
        daoFactory: "",
        governor: "",
        timelock: "",
        erc20votes: "",
        erc721votes: ""
    },
    localhost: {
        proxyFactory: "0x2B2f78c5BF6D9C12Ee1225D5F374aa91204580c3",
        proxyAdmin: "0x756418B817E934f73Aa434DFaD4a686f836AA71d",
        governanceTokenFactory: "0x47C446F02e41006a05735a7d5e0666e5055b44df",
        daoFactory: "0x74311A7F293122487Dc57a9FffC552af67c5B0b7",
        governor: "0x42Cc87749B4031c53181692c537622e5c3b7d061",
        timelock: "0x8d54644bC13d08Fd9CAbe6DD84f7034d44c7B1B5",
        erc20votes: "0xD2547e4AA4f5a2b0a512BFd45C9E3360FeEa48Df",
        erc721votes: "0xB98aEf45544ACFd5A6cD2659b6e61Ce0f003Ae58"
    },
    testnetbsc: {
        proxyFactory: "0x26F5a1f0C3fc3c40F044CdC1f095440e4Dc415b3",
        proxyAdmin: "0xDfBF9fdD368b4c714c2cAAe27BFd7fe7daaD6c7c",
        governanceTokenFactory: "0xd84c774442a974F1CA2aeB48d263b4A85755051D",
        daoFactory: "0x9b1e9A136534314F60cA63Fd7AD3D402AB171597",
        governor: "0x3837448EF733e680dD96030C8E3f9c87EF3e45Ce",
        timelock: "0xDE7F33CC9c7427De326Ab4457C62Bc6942c0DAB2",
        erc20votes: "0xB4Af828e09a803EC0f8fb47B0554b1733beABDA7",
        erc721votes: "0x8109B8672170aacb0fAb7513D4946b75e5B2B88c"
    },
    rinkeby: {
        proxyFactory: "0x733023f0Edc595AEdAE272210A82F2e6f946e3e6",
        proxyAdmin: "0xA10A77C26f991f35FFd8ec499103cDdb7aC3A943",
        governanceTokenFactory: "0xEB728Baf0A194d093d500840177772237d2Dfb6c",
        daoFactory: "0x59691959aB9Db5e0ddd62BAf2b46E836f23e60F9",
        governor: "0xd2dC027574E5F606c0371da7Ad8Af5E4Fee7C7Bc",
        timelock: "0xa8050F0917B47a59eAb83ddc3979a09c25189f51",
        erc20votes: "0x440e868D5aF871cA52d248263B986F2F8586C5b3",
        erc721votes: "0xFA56c7dD32ECA01c399B12AB1fDE66B9Cd9433F8"
    }  
};

module.exports = contracts;