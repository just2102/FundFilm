import { useState } from "react";
import Modal from "react-modal";

import styles from "src/Pages/Campaigns/Campaigns.module.css";
import { useCustomSelector } from "src/Redux/useCustomSelector";

import { useFetchMyCampaigns } from "./hooks/useFetchMyCampaigns";

import CampaignLinks from "../Campaigns/CampaignLinks";
import AddCampaignModal from "../common/AddCampaignModal";
import Preloader from "../common/Preloader";

function MyCampaigns() {
  const account = useCustomSelector().web3.account;
  const contract = useCustomSelector().web3.contract;
  const myCampaigns = useCustomSelector().campaigns.myCampaigns;
  const isFetching = useCustomSelector().campaigns.isFetching;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  useFetchMyCampaigns();

  if (!contract) return <h2>Connect your wallet first!</h2>;

  return (
    <>
      <div className={styles.campaigns}>
        {account ? (
          <button onClick={() => setModalIsOpen(!modalIsOpen)}>Start a campaign</button>
        ) : (
          <h3>Connect your wallet to start a new campaign!</h3>
        )}

        {isFetching && <Preloader loadingText={"Looking for your campaigns..."} />}
        {myCampaigns && <CampaignLinks campaigns={myCampaigns} />}
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
