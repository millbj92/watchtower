import { artifacts, ethers, run } from "hardhat";
import * as fs from "fs";

async function main() {
  // Get the signer
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error("No signers available. Ensure that the private key is correctly configured in the Hardhat network settings.");
  }

  const [deployer] = signers;

  console.log(deployer);

  console.log("Deploying contracts with the account:", deployer.address);

  // Compile the contract
  await run("compile");

  // Deploy the contract
  const WatchtowerLogger = await ethers.getContractFactory("WatchtowerLogger", deployer);
  const watchtowerLogger = await WatchtowerLogger.deploy();

  await watchtowerLogger.waitForDeployment();

  console.log("WatchtowerLogger deployed to:", await watchtowerLogger.getAddress());

  // Save the contract address and ABI
  const contractsDir = __dirname + "/../artifacts/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    contractsDir + "/WatchtowerLogger-address.json",
    JSON.stringify({ address: await watchtowerLogger.getAddress() }, undefined, 2)
  );

  const artifact = await artifacts.readArtifact("WatchtowerLogger");

  fs.writeFileSync(
    contractsDir + "/WatchtowerLogger-abi.json",
    JSON.stringify(artifact.abi, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });