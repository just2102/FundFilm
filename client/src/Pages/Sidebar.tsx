import { useState } from "react";
import Modal from "react-modal";

import githubIcon from "src/assets/github-mark-white.svg";
import profile from "src/assets/profile.svg";
import { useCustomSelector } from "src/Redux/useCustomSelector";
import styles from "src/styles/Sidebar.module.css";

import AddCampaignModal from "./common/AddCampaignModal";

function Sidebar() {
  const account = useCustomSelector().web3.account;
  const network = useCustomSelector().web3.network;

  const [addCampaignModalOpen, setAddCampaignModalOpen] = useState(false);

  return (
    <>
      <div className={styles.sidebar}>
        {!account && <div></div>}
        {network === "SEPOLIA" && <div>TESTNET</div>}
        {network === "POLYGON" && <div>MAINNET</div>}
        {network === "UNSUPPORTED" && <div>UNSUPPORTED NETWORK</div>}
        {account && network !== "SEPOLIA" && (
          <img
            src={profile}
            alt='profile'
          />
        )}
        <button
          disabled={!account}
          id={!account ? "disabled" : ""}
          onClick={() => setAddCampaignModalOpen(true)}
        >
          START
        </button>
        <a
          href='https://github.com/just2102/'
          target='_blank'
          rel='noopener noreferrer'
        >
          <img
            src={githubIcon}
            alt=''
          />
        </a>
      </div>
      <Modal
        style={customStyles}
        isOpen={addCampaignModalOpen}
        onRequestClose={() => setAddCampaignModalOpen(false)}
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

export default Sidebar;
