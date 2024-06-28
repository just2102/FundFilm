import { NavLink, useNavigate } from "react-router-dom";

import { ethers } from "ethers";

import "../../styles/Campaigns.css";
import { Campaign } from "../../types/campaignsTypes";
import { unixToDate } from "../../utils/unixToDate";
import CurrencyLogo from "../common/CurrencyLogo";

interface Props {
  campaigns: Campaign[];
}
const CampaignLinks = ({ campaigns }: Props) => {
  const navigate = useNavigate();

  //   const currency = useCustomSelector().web3.currency; todo: use

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
          className='campaign'
        >
          <NavLink
            to={`/campaigns/${campaignId}`}
            key={campaignId}
          >
            <div className='campaign_title'>{title}</div>
            <div className='campaign_description'>{formattedDescription}</div>
            {image && (
              <div className='campaign_image_preview'>
                <img
                  src={image}
                  alt='image'
                />
              </div>
            )}
          </NavLink>
          <div className='campaign_meta'>
            {hasWithdrawn ? (
              <div className='campaign_meta_item deadline'>Finished</div>
            ) : (
              <div className='campaign_meta_item deadline'>Deadline: {deadline}</div>
            )}
            <div className='campaign_meta_item target'>
              Target: {target}
              <CurrencyLogo></CurrencyLogo>
            </div>

            <div className='campaign_meta_item raised'>
              Raised: {amountCollected}
              <CurrencyLogo></CurrencyLogo>
            </div>
          </div>

          <div className='campaign_getmoreinfo'>
            <button onClick={() => navigate(`/campaigns/${campaignId}`)}>GET MORE INFO</button>
          </div>
        </div>
      </>
    );
  });

  return <>{campaignsMappedAsLinks}</>;
};

export default CampaignLinks;
