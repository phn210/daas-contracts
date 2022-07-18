const { expect } = require("chai");
const { ethers } = require("hardhat");

const setup = require("../scripts/deploy.js");

describe("Main", async() => {
    
    var _;
    var $;
    const zeroAddress = '0x'+'0'.repeat(40);

    before(async() => {

    });

    beforeEach(async() => {
        _ = await setup();
        $ = _.signers;
    })

    it("should do nothing", async() => {
        
    })
})