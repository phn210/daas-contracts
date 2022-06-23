const { ethers, storageLayout } = require("hardhat")

const logDivider = (text) => { 
    console.log()
    console.log(`========== ${text} ==========`);
    console.log();
}

const gas = async (tx) => {
    tx = await tx.wait();
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Gas cost =',
      tx.gasUsed.toString()
    );
};

const ts = async () => {
    let _ts = (await ethers.provider.getBlock()).timestamp;
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Timestamp =',
      _ts.toString()
    );
    return _ts;
}

const bn = async () => {
    let _bn = await ethers.provider.getBlockNumber();
    console.log(
      '\x1b[33m%s\x1b[0m',
      'Block =',
      _bn.toString()
    );
    return _bn;
}

async function moveTimestamp(seconds) {
    console.log("Timestamp before:", await ts());
    await ethers.provider.send("evm_increaseTime", [seconds]);
    await ethers.provider.send("evm_mine");
    console.log("Timestamp after:", await ts());
}

async function jumpTo(timestamp) {
    var now = await (await ethers.provider.getBlock()).timestamp;
    var distance = timestamp - now;
    await moveTimestamp(distance);
}

async function mineBlocks(nums) {
    console.log("Block before:", await bn());
    for (let i = 0; i < nums; i++) await ethers.provider.send("evm_mine");
    console.log("Block after:", await bn());
}

async function exportStorageLayout() {
    await storageLayout.export();
}

const encodeWithSignature = (signature, types, params) => {
    let sigHash = ethers.utils.solidityKeccak256(["bytes"], [ethers.utils.toUtf8Bytes(signature)]).slice(0, 10);

    let data = ethers.utils.defaultAbiCoder.encode(types, params);

    return ethers.utils.solidityPack(["bytes4", "bytes"], [sigHash, data]);
}

module.exports = {
    logDivider,
    gas,
    ts,
    bn,
    moveTimestamp,
    jumpTo,
    mineBlocks,
    exportStorageLayout,
    encodeWithSignature
}