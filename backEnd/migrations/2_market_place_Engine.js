const MarketPlaceEngine = artifacts.require("../contracts/MarketplaceEngine.sol");

module.exports = function(deployer) {
    deployer.deploy(MarketPlaceEngine);
};
