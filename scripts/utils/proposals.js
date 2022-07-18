const { ethers } = require("hardhat");

function prepareProposal(proposal) {
    let actions = proposal.txs
    // .map(tx => tx.data = ethers.utils.defaultAbiCoder.encode(tx.datas.types, tx.datas.params))
    actions.map(action => action.data = ethers.utils.defaultAbiCoder.encode(action.data.types, action.data.params))

    return {
        actions,
        descriptionHash: getDescriptionHash(proposal.ipfsHash)
    }
}

function getDescriptionHash(ipfsHash) {
    let decodedIpfsHash = ethers.utils.base58.decode(ipfsHash).slice(2);

    return '0x'+Array.from(decodedIpfsHash, byte => {
        return (Number(byte).toString(16).padStart(2, '0'));
    }).join('').toString(16);
}

function getIpfsHash(descriptionHash) {
    descriptionHash = (bytes32.toString()).slice(2).match(/.{1,2}/g);
    let encodedIpfsHash = Array.from(descriptionHash, byte => {
        return (parseInt(byte, 16))
    });
    encodedIpfsHash = [18, 32].concat(encodedIpfsHash);
    return ethers.utils.base58.encode(encodedIpfsHash);
}

module.exports = {
    prepareProposal,
    getDescriptionHash,
    getIpfsHash
}