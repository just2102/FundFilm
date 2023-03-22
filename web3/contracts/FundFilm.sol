// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract FundFilm {
    address payable public platformOwner;
    uint256 numberOfCampaigns = 0;
    uint256 public constant SERVICE_FEE = 10; // 10%

    constructor() {
        platformOwner = payable(msg.sender);
    }

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
        bool hasWithdrawn;
    }

    mapping(uint256 => Campaign) public campaigns;

    event CampaignStarted(
        string _title,
        string _description,
        uint256 _target,
        uint256 _deadline,
        string _image
    );

    function startCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        // check for correct date
        require(
            _deadline > block.timestamp,
            "Deadline should be in the future"
        );
        Campaign storage newCampaign = campaigns[numberOfCampaigns];
        newCampaign.owner = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.target = _target;
        newCampaign.deadline = _deadline;
        newCampaign.image = _image;


        numberOfCampaigns++;
        emit CampaignStarted(_title, _description, _target, _deadline, _image);
        return numberOfCampaigns--;
    }

    event DonatedToCampaign(address donator,uint256 _campaignId,uint256 _amount);
    function donateToCampaign(uint256 _id) public payable {
        Campaign storage campaign = campaigns[_id];
        require(
            campaign.hasWithdrawn == false,
            "The owner of this campaign has already withdrawn from it. No further donations allowed."
        );
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        campaign.amountCollected += msg.value;
        emit DonatedToCampaign(msg.sender, _id, msg.value);
    }
    function getDonators(uint256 _id) view public returns(address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    modifier onlyCampaignOwner(uint256 _campaignId) {
        require(
            msg.sender == campaigns[_campaignId].owner,
            "Only campaign owners can withdraw from campaigns!"
        );
        _;
    }
    modifier campaignHasEnded(uint256 _campaignId) {
        require(
            campaigns[_campaignId].deadline <= block.timestamp,
            "Campaign hasn't ended yet"
        );
        _;
    }
    event WithdrewFromCampaign(uint256 _campaignId, address _owner,uint256 _amountCollected);
    function withdrawFromCampaign(uint256 _campaignId)
        public
        onlyCampaignOwner(_campaignId)
    // campaignHasEnded(_campaignId) add when everything else has been tested
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.hasWithdrawn == false, "You can only withdraw once!");
        uint256 sumAfterFee = campaign.amountCollected - ((campaign.amountCollected * SERVICE_FEE) / 100);
        payable(campaign.owner).transfer(sumAfterFee);

        campaign.hasWithdrawn = true;
        emit WithdrewFromCampaign(_campaignId, campaign.owner, sumAfterFee);
    }

    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner);
        _;
    }
    function withdrawServiceFees() onlyPlatformOwner public {
        (bool sent, ) = platformOwner.call{value: address(this).balance}("");
        require(sent, "Failed to withdraw");
    }
}
