import { useSelector, useDispatch } from "react-redux";
import { disconnect, setAccount, setContract, setProvider, setSigner } from "../Redux/web3slice";
// import contractArtifact from "../../../web3/artifacts/contracts/FundFilm.sol/FundFilm.json"
import contractArtifact from "../FundFilm.json"
import { ethers } from "ethers";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.css"
import arrowDownConnected from "../assets/arrowdown-connected.svg"
import nightMode from "../assets/nightmode.svg"
import logoutIcon from "../assets/logout.svg"
import copyIcon from "../assets/copy.svg"
import Snackbar from "@mui/material/Snackbar"
import { useNavigate } from "react-router-dom";

function Header() {
  const account = useSelector((state) => state.web3.account);
  const provider = useSelector((state) => state.web3.provider);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isActive, setIsActive] = useState("dashboard");

  const [toggleDrawer, setToggleDrawer] = useState(false)
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false)

  const handleCopy = () => {
    setCopySnackbarOpen(true);
    navigator.clipboard.writeText(account)
  }
  const handleDisconnect = () => {
    dispatch(disconnect());
  }

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();
        const account = await signer.getAddress();
        const contract = new ethers.Contract("0xC85e2cDE16bdaC9eb3c3AA0fDa4A67a4a78CD5E0", contractArtifact.abi, signer)
        dispatch(setProvider(web3Provider));
        dispatch(setAccount(account));
        dispatch(setSigner(signer));
        dispatch(setContract(contract));
        navigate("/campaigns")
      } else throw new Error("Metamask not found");
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  function sliceAddress(address) {
    const first = address.substring(0,4)
    const second = "..."
    const third = address.substring(address.length-4)
    return first+second+third
  }

  return (
    <header>
      <Snackbar
      anchorOrigin={{ vertical:'top', horizontal:'right' }}
      open={copySnackbarOpen}
      autoHideDuration={1500}
      onClose={()=>setCopySnackbarOpen(false)}
      message="Address copied"></Snackbar>
      <NavLink to={"/campaigns"}>Campaigns</NavLink>
      <NavLink to={"/mycampaigns"}>My Campaigns</NavLink>
      <NavLink to={"/about"}>About</NavLink>
      {account ? (
        <span onClick={()=>setToggleDrawer(!toggleDrawer)}>{sliceAddress(account)} 
          <img src={arrowDownConnected} alt="arrowDown" />
          {toggleDrawer && 
            <div className="drawer">
              <div onClick={handleCopy} className="drawer_action copy">
                <img src={copyIcon} alt="copyAddress" />
                <span>Copy</span>
              </div>

              <div onClick={handleDisconnect} className="drawer_action logout">
                <img src={logoutIcon} alt="logout" />
                <span>Disconnect</span>
              </div>
            </div> }
        </span>
      ) : (
        <button disabled={isConnecting} onClick={handleConnectWallet}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </header>
  );
}

export default Header;
