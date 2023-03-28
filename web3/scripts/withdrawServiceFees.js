const hre = require("hardhat")
const ethers = hre.ethers;

async function main() {
    const [signer] = await ethers.getSigners()

    // get contract at 0x7F714Dc84907DAC784F36e02b349bfE260a4AD39
    const FundFilm = await ethers.getContractFactory('FundFilm', signer)
    const fundFilm = await FundFilm.attach('0xC85e2cDE16bdaC9eb3c3AA0fDa4A67a4a78CD5E0')

    // withdraw service fees
    const tx = await fundFilm.withdrawServiceFees()
    await tx.wait()


    console.log('withdrew service fees')
}

main().then(() => {
  console.log('success!')
}).catch(error => {
  console.error(error)
  process.exit(1)
})