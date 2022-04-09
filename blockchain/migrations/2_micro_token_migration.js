const MicroToken = artifacts.require("MicroToken");

module.exports = function(deployer) {
  deployer.deploy(MicroToken);
};
