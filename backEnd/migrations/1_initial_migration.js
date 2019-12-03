const Migrations = artifacts.require("Migrations");

const MarketPlaceEngine = artifacts.require("../contracts/MarketplaceEngine.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MarketPlaceEngine);
};
