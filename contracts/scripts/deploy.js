const hre = require("hardhat")
const ethers = hre.ethers;

async function main() {
    const [signer] = await ethers.getSigners()

    const FundFilm = await ethers.getContractFactory('FundFilm', signer)

    const fundFilm = await FundFilm.deploy();

    await fundFilm.deployed()

    console.log('Deployed FundFilm on ' + fundFilm.address)
}

main().then(() => {
  console.log('Deployment complete!')
}).catch(error => {
  console.error(error)
  process.exit(1)
})