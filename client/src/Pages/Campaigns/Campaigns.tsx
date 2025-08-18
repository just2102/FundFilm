import { useState, useEffect } from "react";

import { fetchCampaigns, fetchCampaignById } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";

import CampaignLinks from "./CampaignLinks";
import styles from "./Campaigns.module.css";

import Preloader from "../common/Preloader";

const Campaigns = () => {
  const contract = useCustomSelector().web3.contract;
  const dispatch = useCustomDispatch();

  const allCampaignsStore = useCustomSelector().campaigns.campaigns;
  const isFetching = useCustomSelector().campaigns.isFetching;

  const allCampaigns = [...allCampaignsStore].sort((a, b) => {
    return b.deadline.toNumber() - a.deadline.toNumber();
  });

  const [showFinishedCampaigns, setShowFinishedCampaigns] = useState(true);
  const ongoingCampaigns = allCampaigns.filter((campaign) => {
    return campaign.hasWithdrawn === false && campaign.deadline.toNumber() * 1000 > Date.now();
  });

  const [searchQuery, setSearchQuery] = useState("");
  const filteredCampaigns = allCampaigns.filter((campaign) => {
    return campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (contract) {
    contract.on("CampaignStarted", (owner, campaignId, title, description, target, deadline, image, video) => {
      dispatch(fetchCampaigns({ contract }));
    });
  }
  if (contract) {
    contract.on("CampaignEdited", (title, description, target, image, video) => {
      dispatch(fetchCampaigns({ contract }));
    });
  }
  if (contract) {
    contract.on("WithdrewFromCampaign", (campaignId, owner, amountWithdrawn) => {
      dispatch(fetchCampaignById({ contract, campaignId }));
    });
  }
  if (contract) {
    // listen to DonatedToCampaign event and refetch the campaign that was donated to
    contract.on("DonatedToCampaign", (donator, campaignId, amount) => {
      dispatch(fetchCampaignById({ contract, campaignId }));
    });
  }
  if (contract) {
    // listen to CampaignDeadlineExtended event and refetch the campaign that was extended
    contract.on("CampaignDeadlineExtended", (campaignId, newDeadline, feePaid) => {
      dispatch(fetchCampaignById({ contract, campaignId }));
    });
  }

  useEffect(() => {
    if (contract && allCampaigns.length === 0) {
      dispatch(fetchCampaigns({ contract }));
    }
  }, [allCampaigns.length, contract, dispatch]);

  if (!contract) return <h2>Connect your wallet first!</h2>;

  return (
    <>
      {isFetching && <Preloader />}
      <div className={styles.campaigns}>
        <div className={styles.campaigns_searchbar}>
          <div className={styles.campaign_searchbar_item}>
            <input
              checked={showFinishedCampaigns}
              onChange={(e) => setShowFinishedCampaigns(e.target.checked)}
              id='showFinished'
              type='checkbox'
            />
            <label htmlFor='showFinished'>Show finished campaigns</label>
          </div>

          <div className={styles.campaign_searchbar_item}>
            <input
              placeholder='Search...'
              id='search'
              onChange={(e) => setSearchQuery(e.target.value)}
              type='search'
              className={styles.search}
            />
          </div>
        </div>
        {searchQuery && <CampaignLinks campaigns={filteredCampaigns} />}

        {!searchQuery && showFinishedCampaigns && allCampaigns.length > 0 && <CampaignLinks campaigns={allCampaigns} />}

        {!searchQuery && !showFinishedCampaigns && <CampaignLinks campaigns={ongoingCampaigns} />}
      </div>
    </>
  );
};

export default Campaigns;
