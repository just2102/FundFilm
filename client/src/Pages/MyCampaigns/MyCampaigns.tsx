import { useState } from "react";

import styles from "src/Pages/Campaigns/Campaigns.module.css";
import { useCustomSelector } from "src/Redux/useCustomSelector";

import { useFetchMyCampaigns } from "./hooks/useFetchMyCampaigns";

import CampaignLinks from "../Campaigns/CampaignLinks";
import AddCampaignModal from "../common/AddCampaignModal";
import { Modal } from "../common/Modal";
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
      >
        <AddCampaignModal />
      </Modal>
    </>
  );
}

export default MyCampaigns;
