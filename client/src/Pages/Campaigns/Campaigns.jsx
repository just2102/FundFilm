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
import searchIcon from "../../assets/search.svg"

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

    const [searchQuery, setSearchQuery] = useState("")
    const filteredCampaigns = allCampaigns.filter(campaign=>{
        return campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
    })
    

    // listen to CampaignStarted event and refetch campaigns
    if (contract) {
        contract.on("CampaignStarted", ()=>{
        dispatch(fetchCampaigns(contract))
    }) 
    }

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
                    <input placeholder="Search..." id="search" onChange={(e)=>setSearchQuery(e.target.value)} type="search" />
                    {/* <img id={"searchImg"} src={searchIcon} alt="" /> */}
                </div>

            </div>
            {searchQuery && <CampaignLinks campaigns={filteredCampaigns}></CampaignLinks>}

            {(!searchQuery && showFinishedCampaigns && allCampaigns.length) && <CampaignLinks campaigns={allCampaigns}></CampaignLinks>}

            {(!searchQuery && !showFinishedCampaigns) && <CampaignLinks campaigns={ongoingCampaigns}></CampaignLinks> }

        </div>
        </>
     );
}
 
export default Campaigns;