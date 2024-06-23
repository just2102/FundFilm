const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("FundFilm", function() {
    let acc1;
    let acc2;
    let contract;
    let provider;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    beforeEach(async function() {
        [acc1, acc2] = await ethers.getSigners();
        const FundFilm = await ethers.getContractFactory("FundFilm", acc1);
        contract = await FundFilm.deploy();
        provider = ethers.provider;
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
        let video = "My New Campaign Video"

        await expect(contract.startCampaign(title,description,target,deadline,image,video))
        .to.emit(contract, "CampaignStarted")
        .withArgs(title,description,target,deadline,image,video)
    })
    it('should write new campaign properly', async () => {
        let title = "Abrakadabra";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = 1901052120;
        let image = "My New Campaign Image";
        let video = "My New Campaign Video";
        const tx = await contract.startCampaign(title,description,target,deadline,image,video)
        await tx.wait();

        const newCampaign = await contract.campaigns(0);
        expect(newCampaign.title).to.equal(title)
        expect(newCampaign.description).to.equal(description)
        expect(newCampaign.target).to.equal(target)
        expect(newCampaign.deadline).to.equal(deadline)
        expect(newCampaign.image).to.equal(image)
        expect(newCampaign.video).to.equal(video)
    })

    it('should emit DonatedToCampaign event with proper args', async () => {
        let title = "Blablabla";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = 1901052120;
        let image = "My New Campaign Image";
        let video = "My New Campaign Video";
        const tx = await contract.startCampaign(title,description,target,deadline,image,video)
        await tx.wait();

        // donate from acc2
        let campaignId = 0
        const amount = ethers.utils.parseEther("25.0"); // send 25 ETH
        await expect(contract.connect(acc2).donateToCampaign(campaignId, {value: amount}))
        .to.emit(contract, "DonatedToCampaign")
        .withArgs(acc2.address, campaignId, amount);
    })
    it('contract should receive the donated funds', async() => {
        let title = "Blablabla";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = 1901052120;
        let image = "My New Campaign Image";
        let video = "My New Campaign Video";
        const tx = await contract.startCampaign(title,description,target,deadline,image,video)
        await tx.wait();
        // donate from acc2
        let campaignId = 0
        const amount = ethers.utils.parseEther("46.0"); // send 25 ETH
        const tx2 = await contract.donateToCampaign(campaignId, {value: amount})
        await tx2.wait();

        const balanceAfterDonation = await provider.getBalance(contract.address);
        expect(ethers.utils.formatEther(balanceAfterDonation)).to.equal("46.0");

        const campaign0 = await contract.campaigns(0);
        expect(ethers.utils.formatEther(campaign0.amountCollected)).to.equal("46.0");
    })

    it('should emit WithdrewFromCampaign event with proper args', async() => {
        let title = "Blablabla";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = Math.floor(Date.now() / 1000) + 15;
        let image = "My New Campaign Image";
        let video = "My New Campaign Video";
        const tx = await contract.startCampaign(title,description,target,deadline,image,video)
        await tx.wait();
        // donate from acc2
        let campaignId = 0
        const amount = ethers.utils.parseEther("50.0"); // send 50 ETH
        const tx2 = await contract.donateToCampaign(campaignId, {value: amount})
        await tx2.wait();

        await delay(15000);

        const expectedWithdrawalAmount = ethers.utils.parseEther("45.0") // 10% service fee
        await expect(contract.connect(acc1).withdrawFromCampaign(0))
        .to.emit(contract, "WithdrewFromCampaign")
        .withArgs(campaignId, acc1.address, expectedWithdrawalAmount);
    })
    it('should update the contract balance after withdrawal properly', async() => {
        let title = "Blablabla";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = Math.floor(Date.now() / 1000) + 20;
        let image = "My New Campaign Image";
        let video = "My New Campaign Video";
        const tx = await contract.startCampaign(title,description,target,deadline,image, video)
        await tx.wait();
        // donate from acc2
        let campaignId = 0
        const amount = ethers.utils.parseEther("55.0"); // send 55 ETH
        const tx2 = await contract.connect(acc2).donateToCampaign(campaignId, {value: amount})
        await tx2.wait();

        const oldContractBalance = await provider.getBalance(contract.address);
        // withdraw from campaign from acc1 after delay
        await delay(19000);

        const tx3 = await contract.connect(acc1).withdrawFromCampaign(0);
        await tx3.wait();
        // check new contract balance
        const newContractBalance = await provider.getBalance(contract.address);
        const expectedNewContractBalance = ethers.utils.parseEther("5.5"); // 10% from 55 ETH
        expect(newContractBalance).to.equal(expectedNewContractBalance)
        // and check new owner balance
        const newOwnerBalance = await provider.getBalance(acc1.address);
        const expectedNewOwnerBalance = ethers.utils.parseEther("1000.0");
        expect(newOwnerBalance).to.be.greaterThan(expectedNewOwnerBalance);
    })
    it('should not allow withdrawal before expiration', async() => {
        let title = "Blablabla";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = 1901052120;
        let image = "My New Campaign Image";
        let video = "My New Campaign Video";
        const tx = await contract.startCampaign(title,description,target,deadline,image, video)
        await tx.wait();
        // donate from acc2
        let campaignId = 0
        const amount = ethers.utils.parseEther("55.0"); // send 55 ETH
        const tx2 = await contract.connect(acc2).donateToCampaign(campaignId, {value: amount})
        await tx2.wait();

        const oldContractBalance = await provider.getBalance(contract.address);
        // withdraw from campaign from acc1
        await expect(contract.connect(acc1).withdrawFromCampaign(0))
        .to.be.revertedWith("Campaign hasn't ended yet")
    })

    it('platform owner should be able to withdraw service fees', async() => {
        let title = "Blablabla";
        let description = "My New Campaign Description";
        let target = ethers.utils.parseEther("50.0");
        let deadline = Math.floor(Date.now() / 1000) + 30;
        console.log(deadline)
        let image = "My New Campaign Image";
        let video = "My New Campaign Video";
        const tx = await contract.startCampaign(title,description,target,deadline,image, video)
        await tx.wait();
        // donate from acc2
        let campaignId = 0
        const amount = ethers.utils.parseEther("55.0"); // send 55 ETH
        const tx2 = await contract.connect(acc2).donateToCampaign(campaignId, {value: amount})
        await tx2.wait();
        // withdraw from campaign after delay
        await delay(30000);
        const tx3 = await contract.connect(acc1).withdrawFromCampaign(0);
        await tx3.wait();
        // withdraw service fees
        const tx4 = await contract.connect(acc1).withdrawServiceFees()
        // check new owner balance
        const newOwnerBalance = await provider.getBalance(acc1.address);
        const expectedNewOwnerBalance = ethers.utils.parseEther("1000.0")
        expect(newOwnerBalance).to.be.greaterThan(expectedNewOwnerBalance);
        // check new contract balance (should be 0)
        const newContractBalance = await provider.getBalance(contract.address);
        const expectedNewContractBalance = ethers.utils.parseEther("0.0");
        expect(newContractBalance).to.equal(expectedNewContractBalance);
    })
})
