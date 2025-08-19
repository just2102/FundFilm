import { useState } from "react";

import githubIcon from "src/assets/github-mark-white.svg";
import profile from "src/assets/profile.svg";
import { useCustomSelector } from "src/Redux/useCustomSelector";
import { networks } from "src/utils/const";

import AddCampaignModal from "./common/AddCampaignModal";
import { Modal } from "./common/Modal";
import styles from "./Sidebar.module.css";

function Sidebar() {
  const account = useCustomSelector().web3.account;
  const network = useCustomSelector().web3.network;

  const [addCampaignModalOpen, setAddCampaignModalOpen] = useState(false);

  return (
    <>
      <div className={styles.sidebar}>
        {!account && <div></div>}
        {(network === networks.Sepolia || network === "SEPOLIA") && <div>TESTNET</div>}
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
        isOpen={addCampaignModalOpen}
        onRequestClose={() => setAddCampaignModalOpen(false)}
      >
        <AddCampaignModal />
      </Modal>
    </>
  );
}

export default Sidebar;
