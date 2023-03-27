import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaigns } from "../../Redux/campaignSlice";
import Campaign from "./Campaign";
import "../../styles/Campaigns.css"
import Preloader from "../common/Preloader";
import { NavLink, useNavigate } from "react-router-dom";
import CampaignLink from "./CampaignLinks";
import { Route, Routes } from "react-router-dom";
import CampaignLinks from "./CampaignLinks";

const Campaigns = () => {
    const contract = useSelector(state=>state.web3.contract);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const allCampaigns = useSelector(state=>state.campaigns.campaigns);
    const isFetching = useSelector(state=>state.campaigns.isFetching)

    const [showFinishedCampaigns, setShowFinishedCampaigns] = useState(false)
    const ongoingCampaigns = allCampaigns.filter(campaign=>{
        return campaign.hasWithdrawn === false;
    })
    useEffect(()=>{
        if (allCampaigns.length === 0) {
            dispatch(fetchCampaigns(contract))
        }
    },[contract])
    return ( 
        <>
        {isFetching && <Preloader/>}
        <div className="campaigns">
            <div className="campaigns_searchbar">
                <div className="campaign_searchbar_item">
                    <input checked={showFinishedCampaigns} onChange={(e)=>setShowFinishedCampaigns(e.target.checked)} id="showFinished" type="checkbox" />
                    <label htmlFor="showFinished">Show finished campaigns</label>
                </div>

                <div className="campaign_searchbar_item">
                    <input type="search" />
                </div>

            </div>
            {(showFinishedCampaigns && allCampaigns.length) && <CampaignLinks campaigns={allCampaigns}></CampaignLinks>}

            {!showFinishedCampaigns && <CampaignLinks campaigns={ongoingCampaigns}></CampaignLinks> }

        </div>
        </>
     );
}
 
export default Campaigns;