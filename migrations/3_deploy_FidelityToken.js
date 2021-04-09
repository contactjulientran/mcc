const FidelityToken = artifacts.require("FidelityToken");

module.exports = function (deployer) {
    deployer.deploy(FidelityToken, 23);
};