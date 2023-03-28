import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../styles/Sidebar.css"
import { NavLink } from 'react-router-dom';
import logo from "../assets/logo.svg"
import profile from "../assets/profile.svg"
import sun from "../assets/sun.svg"
import githubIcon from "../assets/github-mark-white.svg"
import Modal from "react-modal";
import AddCampaignModal from './common/AddCampaignModal';

function Sidebar() {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');

    const [addCampaignModalOpen, setAddCampaignModalOpen] = useState(false);
  return (
    <>
    <div className='sidebar'>
        <NavLink to={"/profile"}> <img src={profile} alt="profile" /> </NavLink>
        <button onClick={()=>setAddCampaignModalOpen(true)}>START</button>
        <a href="https://github.com/just2102/" target="_blank"><img src={githubIcon} alt="" /></a>
        {/* <img src={sun} alt="sun" /> */}
    </div>
    <Modal 
    style={customStyles} 
    isOpen={addCampaignModalOpen}
    onRequestClose={()=>setAddCampaignModalOpen(false)}>
      <AddCampaignModal />
    </Modal>
    </>
  )
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

export default Sidebar