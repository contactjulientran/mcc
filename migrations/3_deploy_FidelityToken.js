const FidelityToken = artifacts.require("FidelityToken");

module.exports = function (deployer) {
    deployer.deploy(FidelityToken, "1000000000000000000000"); // 1000 FTK
};