import React from "react";
import Modal from "react-modal";
import { useState } from "react";
import "../styles/MyCampaigns.css";
import { useSelector } from "react-redux";

function AddCampaignModal() {
  return (
    <>
      <div className="addCampaignModal">
        <h3>Add a campaign!</h3>
        <label htmlFor="title">Your movie title:</label>
        <input id="title" type="text" placeholder="Ascending..." />

        <label htmlFor="description">Describe your movie:</label>
        <textarea name="description" id="description"></textarea>

        <label htmlFor="target">Campaign target: </label>
        <div><input id="target" type="number"  placeholder="50..."/></div>

        <label htmlFor="deadline">Deadline: </label>
        <input id="deadline" type="date" />

        <label htmlFor="image">Upload an image: </label>
        <input id="image" type="file" />
        <button>Add!</button>
      </div>
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
      maxHeight: "70vh"
    },
  };

function MyCampaigns() {
  const account = useSelector(state=>state.web3.account)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="mycampaigns">
      {account 
      ? <button onClick={() => setModalIsOpen(!modalIsOpen)}>
        Start a campaign
      </button>
      : <h3>Connect wallet to add a new campaign!</h3> }
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <AddCampaignModal />
      </Modal>
    </div>
  );
}

export default MyCampaigns;
