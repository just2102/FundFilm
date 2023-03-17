// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract FundFilm {
    uint256 numberOfCampaigns = 0;

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;

    function startCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage newCampaign = campaigns[numberOfCampaigns];
        // check for correct date
        require(
            newCampaign.deadline > block.timestamp,
            "Deadline should be in the future"
        );
        newCampaign.owner = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.target = _target;
        newCampaign.deadline = _deadline;
        newCampaign.image = _image;

        numberOfCampaigns++;
        return numberOfCampaigns--;
    }

    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        (bool sent, ) = payable(campaign.owner).call{value: msg.value}("");
        require(sent, "Donation failed");
        campaign.amountCollected += msg.value;
    }

    function getDonators(uint256 _id) view public returns(address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns(Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i<numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    modifier onlyCampaignOwner (uint256 _campaignId) {
        require(msg.sender==campaigns[_campaignId].owner, "Only campaign owners can withdraw from campaigns!");
        _;
    }
    modifier campaignHasEnded (uint256 _campaignId) {
        require(campaigns[_campaignId].deadline <= block.timestamp, "Campaign hasn't ended yet");
        _;
    }
    function withdrawFromCampaign(uint256 _campaignId) onlyCampaignOwner(_campaignId) campaignHasEnded(_campaignId) public {
        Campaign memory campaign = campaigns[_campaignId];
        payable(campaign.owner).transfer(campaign.amountCollected);
    }
}
