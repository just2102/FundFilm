const { expect } = require("chai");
const {ethers} = require("hardhat");


describe("FundFilm", function() {
    let acc1;
    let acc2;
    let contract;

    beforeEach(async function() {
        [acc1, acc2] = await ethers.getSigners();
        const FundFilm = await ethers.getContractFactory("FundFilm", acc1);
        contract = await FundFilm.deploy();
        await contract.deployed();
    })

    it('should be deployed', async () => {
        expect(contract.address).to.exist;
        console.log('FundFilm contract address: ' + contract.address)
        console.log('deployed successfully')
    });

    it('should emit CampaignStarted event with proper args', async () => {
        let title = "My New Campaign Title";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = 1901052120;
        let image = "My New Campaign Image";

        await expect(contract.startCampaign(title,description,target,deadline,image))
        .to.emit(contract, "CampaignStarted")
        .withArgs(title,description,target,deadline,image)
    })
    it('should write new campaign properly', async () => {
        let title = "Abrakadabra";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = 1901052120;
        let image = "My New Campaign Image";

        const tx = await contract.startCampaign(title,description,target,deadline,image)
        await tx.wait();

        const newCampaign = await contract.campaigns(0);
        expect(newCampaign.title).to.equal(title)
        expect(newCampaign.description).to.equal(description)
        expect(newCampaign.target).to.equal(target)
        expect(newCampaign.deadline).to.equal(deadline)
        expect(newCampaign.image).to.equal(image)
    })

    it('should emit DonatedToCampaign event with proper args', async () => {
        let title = "Blablabla";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = 1901052120;
        let image = "My New Campaign Image";
        const tx = await contract.startCampaign(title,description,target,deadline,image)
        await tx.wait();

        // donate from acc2
        let campaignId = 0
        const amount = ethers.utils.parseEther("25.0"); // send 25 ETH
        await expect(contract.connect(acc2).donateToCampaign(campaignId, {value: amount}))
        .to.emit(contract, "DonatedToCampaign")
        .withArgs(acc2.address, campaignId, amount);
    })
    
})
