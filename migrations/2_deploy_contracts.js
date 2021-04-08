var MCCUserToken = artifacts.require("./MCCUserToken.sol");

module.exports = function (deployer) {
  deployer.deploy(MCCUserToken);
};
