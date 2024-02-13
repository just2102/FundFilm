import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import profile from "../assets/profile.svg";
import githubIcon from "../assets/github-mark-white.svg";
import Modal from "react-modal";
import AddCampaignModal from "./common/AddCampaignModal";
import { useCustomSelector } from "../Redux/useCustomSelector";

function Sidebar() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState("dashboard");
  const account = useCustomSelector().web3.account;
  const network = useCustomSelector().web3.network;

  const [addCampaignModalOpen, setAddCampaignModalOpen] = useState(false);
  useEffect(() => {}, [account]);
  return (
    <>
      <div className="sidebar">
        {!account && <div></div>}
        {network === "SEPOLIA" && <div>TESTNET</div>}
        {network === "POLYGON" && <div>MAINNET</div>}
        {network === "UNSUPPORTED" && <div>UNSUPPORTED NETWORK</div>}
        {account && network !== "SEPOLIA" && (
          <NavLink to={"/profile"}>
            {" "}
            <img src={profile} alt="profile" />{" "}
          </NavLink>
        )}
        <button
          disabled={!account}
          id={!account ? "disabled" : ""}
          onClick={() => setAddCampaignModalOpen(true)}
        >
          START
        </button>
        <a href="https://github.com/just2102/" target="_blank">
          <img src={githubIcon} alt="" />
        </a>
        {/* <img src={sun} alt="sun" /> */}
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
