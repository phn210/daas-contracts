const proposals = (mockGoverned) => {
    return {
        mock: [
            {
                shortDes: "Add new token",
                txs: [
                    {
                        target: mockGoverned.address,
                        value: 0,
                        signature: "toggleWhitelistedToken(address)",
                        data: {
                            types: ["address"],
                            params: ['0x'+'0'.repeat(39)+'1']
                        }
                    }, 
                    {
                        target: mockGoverned.address,
                        value: 0,
                        signature: "setPriceOracle(address,address)",
                        data: {
                            types: ["address", "address"],
                            params: ['0x'+'0'.repeat(39)+'0', '0x'+'0'.repeat(39)+'1']
                        }
                    }
                ],
                ipfsHash: "QmSLn7MTFjAtPHyZeQ83XKwwB4HGxbF3n82vRefqCz4LDC"
            },
            {
                shortDes: "Update interest rate",
                txs: [
                    {
                        target: mockGoverned.address,
                        value: 0,
                        signature: "setInterestRate(uint256)",
                        data: {
                            types: ["uint256"],
                            params: [10]
                        }
                    }
                ],
                ipfsHash: "QmYjT1tzB1n6X2mymf2e9Bg2LzbB5V1zxYDzwFFeHPYJfz"
            },
            {
                shortDes: "Update tokens' price oracle",
                txs: [
                    {
                        target: mockGoverned.address,
                        value: 0,
                        signature: "setPriceOracle(address,address)",
                        data: {
                            types: ["address", "address"],
                            params: ['0x'+'0'.repeat(39)+'1', '0x'+'0'.repeat(39)+'1']
                        }
                    },
                    {
                        target: mockGoverned.address,
                        value: 0,
                        signature: "setPriceOracle(address,address)",
                        data: {
                            types: ["address", "address"],
                            params: ['0x'+'0'.repeat(39)+'2', '0x'+'0'.repeat(39)+'2']
                        }
                    },
                    {
                        target: mockGoverned.address,
                        value: 0,
                        signature: "setPriceOracle(address,address)",
                        data: {
                            types: ["address", "address"],
                            params: ['0x'+'0'.repeat(39)+'3', '0x'+'0'.repeat(39)+'3']
                        }
                    }
                ],
                ipfsHash: "QmQKcFyGR9AJvSsJ34zhCM4ouQ9hYfG4A6pbZVhqJB7wFj"
            }
        ],
        testnetbsc: [],
        rinkeby: []
    }
}


module.exports = proposals