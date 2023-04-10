import React, { useEffect } from "react";
import Modal from "react-modal";
import { useState } from "react";
import "../../styles/Campaigns.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCampaigns, startCampaign } from "../../Redux/campaignSlice";
import CampaignLinks from "../Campaigns/CampaignLinks";
import Preloader from "../common/Preloader";
import AddCampaignModal from "../common/AddCampaignModal";


function MyCampaigns() {
  const account = useSelector(state=>state.web3.account)
  const contract = useSelector(state=>state.web3.contract)
  const myCampaigns = useSelector(state=>state.campaigns.myCampaigns)
  const isFetching = useSelector(state=>state.campaigns.isFetching)

  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);


  useEffect(()=>{
      if (contract && account && myCampaigns.length === 0) {
        dispatch(fetchMyCampaigns({contract, account}));
      }
  },[account])

  if (!contract) return <h2>Connect your wallet first!</h2>
  return (
    <>
    <div className="campaigns my">

      {account 
      ? <button onClick={() => setModalIsOpen(!modalIsOpen)}>
        Start a campaign
      </button>
      : <h3>Connect your wallet to start a new campaign!</h3> }
      
      {isFetching && <Preloader loadingText={'Looking for your campaigns...'}/>}
      {myCampaigns && <CampaignLinks campaigns={myCampaigns}/>}
 
    </div>
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <AddCampaignModal />
    </Modal>
    </>
  );
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflow: "auto",
    maxHeight: "70vh",
    backgroundColor: "#101010",
    color: "white",
  },
};

export default MyCampaigns;
