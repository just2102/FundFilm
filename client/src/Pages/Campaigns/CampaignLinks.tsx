import { NavLink, useNavigate } from "react-router-dom";

import { ethers } from "ethers";
import styles from "src/Pages/Campaigns/Campaigns.module.css";

import { Campaign } from "../../types/campaignsTypes";
import { unixToDate } from "../../utils/unixToDate";
import CurrencyLogo from "../common/CurrencyLogo";

interface Props {
  campaigns: Campaign[];
}
const CampaignLinks = ({ campaigns }: Props) => {
  const navigate = useNavigate();

  const campaignsMappedAsLinks = campaigns.map((campaign: any) => {
    const { campaignId, title, description, image, hasWithdrawn } = campaign;
    const formattedDescription = description.length > 100 ? description.slice(0, 100) + "..." : description;
    const target = ethers.utils.formatEther(campaign.target);
    const amountCollected = ethers.utils.formatEther(campaign.amountCollected);
    const deadline = unixToDate(campaign.deadline);

    return (
      <>
        <div
          key={campaignId}
          className={styles.campaign}
        >
          <NavLink
            to={`/campaigns/${campaignId}`}
            key={campaignId}
          >
            <div className={styles.campaign_title}>{title}</div>
            <div className={styles.campaign_description}>{formattedDescription}</div>
            {image && (
              <div className={styles.campaign_image_preview}>
                <img
                  src={image}
                  alt='image'
                />
              </div>
            )}
          </NavLink>
          <div className={styles.campaign_meta}>
            {hasWithdrawn ? <div className={styles.deadline}>Finished</div> : <div className={styles.deadline}>Deadline: {deadline}</div>}
            <div className={styles.target}>
              Target: {target}
              <CurrencyLogo></CurrencyLogo>
            </div>

            <div className={styles.raised}>
              Raised: {amountCollected}
              <CurrencyLogo></CurrencyLogo>
            </div>
          </div>

          <div className={styles.campaign_getmoreinfo}>
            <button onClick={() => navigate(`/campaigns/${campaignId}`)}>GET MORE INFO</button>
          </div>
        </div>
      </>
    );
  });

  return <>{campaignsMappedAsLinks}</>;
};

export default CampaignLinks;
