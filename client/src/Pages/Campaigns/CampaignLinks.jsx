import { ethers } from "ethers";
import { NavLink, useNavigate } from "react-router-dom";
import ethLogo from "../../assets/eth.svg"
import maticLogo from "../../assets/matic.svg"
import "../../styles/Campaigns.css"
import { unixToDate } from "../../utils/unixToDate";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CampaignLinks = ({campaigns}) => {
    const navigate = useNavigate();

    const currency = useSelector(state=>state.web3.currency)
    const [currencyLogo, setCurrencyLogo] = useState(null)

    const campaignsMappedAsLinks = campaigns?.map(campaign=>{
        const {owner, campaignId, title, description, video, image, hasWithdrawn} = campaign;
        const formattedDescription = description.length>100 ? description.slice(0,100)+"..." : description;
        const target = ethers.utils.formatEther(campaign.target);
        const amountCollected = ethers.utils.formatEther(campaign.amountCollected)
        const deadline = unixToDate(campaign.deadline)    
        return (
        <>
        <div key={campaignId} className="campaign">
            <NavLink to={`/campaigns/${campaignId}`} key={campaignId}>
            <div className="campaign_title">{title}</div>
            <div className="campaign_description">{formattedDescription}</div>
            <div className="campaign_image_preview"><img src={image} alt="image" /></div>
            </NavLink>
            <div className="campaign_meta">
               {hasWithdrawn 
               ? <div className="campaign_meta_item deadline">Finished</div>
               : <div className="campaign_meta_item deadline">Deadline: {deadline}</div> }
                <div className="campaign_meta_item target">Target: {target} <img id="currencyLogo" src={currencyLogo} alt="eth" /></div>
                <div className="campaign_meta_item raised">Raised: {amountCollected} <img id="currencyLogo" src={currencyLogo} alt="eth" /> </div>
            </div>


            <div className="campaign_getmoreinfo">
                <button onClick={()=>navigate(`/campaigns/${campaignId}`)}>GET MORE INFO</button>
            </div>
        </div>
        </>
        )
    })
    useEffect(()=>{
        if(currency==="ETH"){
            setCurrencyLogo(ethLogo)
        }
        if(currency==="MATIC"){
            setCurrencyLogo(maticLogo)
        }
    },[currency])
    return ( 
        <>
        {campaignsMappedAsLinks}
        </>
     );
}
 
export default CampaignLinks;