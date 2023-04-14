import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCampaignById, fetchCampaigns } from "../../Redux/campaignSlice";
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

    const [showFinishedCampaigns, setShowFinishedCampaigns] = useState(true)
    const ongoingCampaigns = allCampaigns.filter(campaign=>{
        return campaign.hasWithdrawn === false;
    })

    const [searchQuery, setSearchQuery] = useState("")
    const filteredCampaigns = allCampaigns.filter(campaign=>{
        return campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
    })
    
    if (contract) {
        contract.on("CampaignStarted", (owner, campaignId, title, description, target, deadline, image, video)=>{
        dispatch(fetchCampaigns(contract))
    }) 
    }
    if (contract) {
        contract.on("CampaignEdited", (title, description, target, image, video)=>{
        dispatch(fetchCampaigns(contract))
    })
    }
    if (contract) {
        contract.on("WithdrewFromCampaign", (campaignId, owner, amountWithdrawn)=>{
        dispatch(fetchCampaignById(contract, campaignId))
    })
    }
    if (contract) {
        // listen to DonatedToCampaign event and refetch the campaign that was donated to
        contract.on("DonatedToCampaign", (donator, campaignId, amount)=>{
        dispatch(fetchCampaignById(contract, campaignId))
    })
    }
    if (contract) {
        // listen to CampaignDeadlineExtended event and refetch the campaign that was extended
        contract.on("CampaignDeadlineExtended", (campaignId, newDeadline, feePaid)=>{
        dispatch(fetchCampaignById(contract, campaignId))
    })
    }

    useEffect(()=>{
        if (contract && allCampaigns.length === 0) {
            dispatch(fetchCampaigns(contract))
        }
    },[contract])
    
    if (!contract) return <h2>Connect your wallet first!</h2>
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