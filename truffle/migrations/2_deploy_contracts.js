const BriandToken = artifacts.require("BriandToken");
const BriandTokenSale = artifacts.require("BriandTokenSale");

module.exports = async function(deployer) {
  // const tokenPrice = 1000000000000000;

  await deployer.deploy(BriandToken)

  await deployer.deploy(BriandTokenSale, BriandToken.address, 1000000000000000)
  
  // const briandToken = await BriandToken.deployed()
};