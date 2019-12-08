const path = require('path');
const fs = require('fs');
const solc = require('solc');

const marketplaceEnginePath = path.resolve(__dirname, 'contracts', 'MarketplaceEngine.sol');
const source = fs.readFileSync(marketplaceEnginePath, 'UTF-8');
module.exports = solc.compile(source, 1).contracts[':MarketplaceEngine'];
