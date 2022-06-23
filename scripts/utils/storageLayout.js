const { storageLayout } = require("hardhat")

async function main() {
    await storageLayout.export();
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