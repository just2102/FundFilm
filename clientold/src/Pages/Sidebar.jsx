import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../styles/Sidebar.css"
import { NavLink } from 'react-router-dom';
import logo from "../assets/logo.svg"
import profile from "../assets/profile.svg"
import sun from "../assets/sun.svg"
import githubIcon from "../assets/github-mark-white.svg"

function Sidebar() {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState('dashboard');
  return (
    <div className='sidebar'>
        <NavLink to={"/profile"}> <img src={profile} alt="profile" /> </NavLink>
        <a href="https://github.com/just2102/" target="_blank"><img src={githubIcon} alt="" /></a>
        <img src={sun} alt="sun" />
    </div>
  )
}

export default Sidebar