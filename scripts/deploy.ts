import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const Contract = await ethers.getContractFactory("FHELottery");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("Contract deployed to:", address);
  fs.writeFileSync("deployedAddress.txt", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
