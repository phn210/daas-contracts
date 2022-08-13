const fs = require('fs')
const { ethers, network } = require("hardhat")
// const helper = require("./scripts/helper");

async function main() {
    const names = [
        "DAOFactory",
        "ProxyAdmin",
        "ProxyFactory",
        "GovernanceTokenFactory",
        "Governor",
        "Timelock",
        "ERC20Votes",
        "ERC721Votes"
    ]
    
    const output = await Promise.all(names.map(e => ethers.getContractFactory(e)));
    
    // const deployed = helper.deployed();

    let contracts = Object.keys(output).filter(
        (name) => output[name] && output[name].constructor?.name == 'ContractFactory'
    ).reduce(
        (obj, name) => 
            Object.assign(obj, {
                [names[name].toLowerCase()]: {
                    // address: deployed[network.name][names[name].toLowerCase()] ?? '',
                    address: '',
                    interface: output[name].interface.format('full')
                }
            })
        , {
            ['']: {
                chainId: network.config.chainId ?? '',
                explorer: network.config.explorer ?? ''
            } 
        }
    );
    
    fs.writeFileSync(`${process.cwd()}/admin/${network.config.chainId}.js`, 'export default ' + JSON.stringify(contracts));
}

main()
.then(() => process.exit())
.catch((e) => {
    console.error(e);
    process.exit(1);
})
