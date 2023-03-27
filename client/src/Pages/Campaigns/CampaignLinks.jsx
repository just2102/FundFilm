import { ethers } from "ethers";
import { NavLink, useNavigate } from "react-router-dom";
import ethLogo from "../../assets/ethlogo.svg"
import "../../styles/Campaigns.css"
import { unixToDate } from "../../utils/unixToDate";

const CampaignLinks = ({campaigns}) => {
    const navigate = useNavigate();

    const campaignsMappedAsLinks = campaigns?.map(campaign=>{
        const {owner, campaignId, title, description, image, hasWithdrawn} = campaign;
        const target = ethers.utils.formatEther(campaign.target);
        const amountCollected = ethers.utils.formatEther(campaign.amountCollected)
        const deadline = unixToDate(campaign.deadline)    
        return (
        <>
        <div className="campaign">
            <NavLink to={`/campaigns/${campaignId}`} key={campaignId}>
            <div className="campaign_title">{title}</div>
            <div className="campaign_description">{description}</div>

            <div className="campaign_meta">
                <div className="campaign_meta_item deadline">Deadline: {deadline}</div>
                <div className="campaign_meta_item target">Target: {target} <img id="ethlogo" src={ethLogo} alt="eth" /></div>
                <div className="campaign_meta_item raised">Raised: {amountCollected} <img id="ethlogo" src={ethLogo} alt="eth" /> </div>
            </div>
            </NavLink>

            <div className="campaign_getmoreinfo">
                <button onClick={()=>navigate(`/campaigns/${campaignId}`)}>GET MORE INFO</button>
            </div>
        </div>
        </>
        )
    })
    return ( 
        <>
        {campaigns.length && campaignsMappedAsLinks}
        </>
     );
}
 
export default CampaignLinks;