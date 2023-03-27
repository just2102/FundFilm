import { ethers } from "ethers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ethLogo from "../../assets/ethlogo.svg"
import { fetchCampaignById } from "../../Redux/campaignSlice";
import "../../styles/Campaigns.css"
import { unixToDate } from "../../utils/unixToDate";
import Preloader from "../common/Preloader";

const Campaign = () => {
    const {campaignId} = useParams()
    const campaign = useSelector(state=>state.campaigns.currentlyDisplayedCampaign);
    const contract = useSelector(state=>state.web3.contract)

    const dispatch = useDispatch();
    let owner, title, description, image, hasWithdrawn, target, amountCollected, deadline;
    if (campaign) {
        owner = campaign.owner;
        title = campaign.title;
        description = campaign.description;
        image = campaign.image;
        hasWithdrawn = campaign.hasWithdrawn;
        target = ethers.utils.formatEther(campaign.target);
        amountCollected = ethers.utils.formatEther(campaign.amountCollected)
        deadline = unixToDate(campaign.deadline)
    }
    useEffect(()=>{
        dispatch(fetchCampaignById({contract, campaignId}))
    },[campaignId, contract])
    return (
    <>
        {!campaign && <Preloader/> }
        {campaign && 
        <div className="campaign">
            <div className="campaign_title">{title}</div>
            <div className="campaign_description">{description}</div>

            <div className="campaign_meta">
                <div className="campaign_meta_item deadline">Deadline: {deadline}</div>
                <div className="campaign_meta_item target">Target: {target} <img id="ethlogo" src={ethLogo} alt="eth" /></div>
                <div className="campaign_meta_item raised">Raised: {amountCollected} <img id="ethlogo" src={ethLogo} alt="eth" /> </div>
            </div>

            <div className="campaign_donate">
                <button>DONATE</button>
            </div>

        </div>
        }
    </>);
}
 
export default Campaign;