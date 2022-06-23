function decodeNum(data, tonum=false) {
    if (true) {
        const e3bf = require('ethers').BigNumber.from;
        return tonum ? e3bf(data).toNumber() : e3bf(data);
    } else {
        const w3u = require('web3').utils
        return tonum ? w3u.toNumber(data) : w3u.toBN(data);
    }
}

function decodePackedStruct (data, definitions) {
    const obj = {};
    let slot = 0;
    let c = 0;
    try {
        for (let i = 0; i != definitions.length; i++) {
            let def = definitions[i];
            if ((c + def.size > 256)) {
                slot++;
                c = 0;
            }

            let hex = '0x' + data[slot].slice(data[slot].indexOf('0x') == 0 ? 2 : 0).slice(-(c+def.size) / 4, (256-c)/4)
            c += def.size;

            if (def.type == 'uint') {
                hex = decodeNum(hex, (def.size <= 48));
                if (def.isTime)
                    hex = (hex != 0) ? new Date(hex * 1000) : null;
            } else if (def.type == 'bool') {
                hex = (decodeNum(hex, true) == 1);
            }

            obj[def.name] = hex;
        }
    } catch (e) {
        console.warn('decodePacked:', e.message);
    }
    return obj;
}

function proposalList(data) {
    const definitions = [
        { name: 'id', type: 'uint', size: 256 },
        { name: 'forVotes', type: 'uint', size: 128 },
        { name: 'againstVotes', type: 'uint', size: 128 },
        { name: 'abstainVotes', type: 'uint', size: 128 },
        { name: 'startBlock', type: 'uint', size: 64 },
        { name: 'duration', type: 'uint', size: 32 },
        { name: 'eta', type: 'uint', size: 32 },
        { name: 'proposer', type: 'address', size: 160 },
        { name: 'cancelled', type: 'bool', size: 8 },
        { name: 'executed', type: 'bool', size: 8 }
        //mapping()
    ]

    if (data[0] instanceof Array) {
        return data.map(e => proposalList(e));
    }
    return decodePackedStruct(data, definitions);
}

function daoList(data) {
    const definitions = [
        { name: 'infoHash', type: 'bytes', size: 256 },
        { name: 'proxyAdmin', type: 'address', size: 160 },
        { name: 'governor', type: 'address', size: 160 },
        { name: 'standard', type: 'uint', size: 8 },
        { name: 'isRetired', type: 'bool', size: 8 },
        { name: 'isBlacklisted', type: 'bool', size: 8 }
    ]

    if (data[0] instanceof Array) {
        return data.map(e => daoList(e));
    }
    return decodePackedStruct(data, definitions);
}

module.exports = {
    proposalList,
    daoList
}


