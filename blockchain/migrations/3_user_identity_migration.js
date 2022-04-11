const UserIdentity = artifacts.require("UserIdentity");
const BankLoan = artifacts.require("BankLoan");
const InsurancePolicy = artifacts.require("InsurancePolicy");
const CarRental = artifacts.require("CarRental");
const MicroToken = artifacts.require("MicroToken");

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(UserIdentity);
  const userIdentityInstance = await UserIdentity.deployed();
  await deployer.deploy(MicroToken);
  const microTokenInstance = await MicroToken.deployed();

  console.log(userIdentityInstance.address);

  await deployer.deploy(BankLoan, userIdentityInstance.address);
  await deployer.deploy(InsurancePolicy, userIdentityInstance.address, {from: accounts[3]});
  await deployer.deploy(CarRental, userIdentityInstance.address, microTokenInstance.address, {from: accounts[4]});
};