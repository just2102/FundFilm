import { useSelector, useDispatch } from "react-redux";
import { setAccount, setContract, setProvider, setSigner } from "../Redux/web3slice";
import contractArtifact from "../../../web3/artifacts/contracts/FundFilm.sol/FundFilm.json"
import { ethers } from "ethers";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.css"
import arrowDownConnected from "../assets/arrowdown-connected.svg"
import nightMode from "../assets/nightmode.svg"

function Header() {
  const [isActive, setIsActive] = useState("dashboard");
  const [toggleDrawer, setToggleDrawer] = useState(false)
  const account = useSelector((state) => state.web3.account);
  const provider = useSelector((state) => state.web3.provider);
  const dispatch = useDispatch();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();
        const account = await signer.getAddress();
        const contract = new ethers.Contract("0xD7ec34d4Ccf05BF1918Fe14d79AA65dcC94ff624", contractArtifact.abi, signer)
        dispatch(setProvider(web3Provider));
        dispatch(setAccount(account));
        dispatch(setSigner(signer));
        dispatch(setContract(contract));
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
      <NavLink to={"/campaigns"}>Campaigns</NavLink>
      <NavLink to={"/mycampaigns"}>My Campaigns</NavLink>
      <NavLink to={"/about"}>About</NavLink>
      {account ? (
        <span>{sliceAddress(account)} <img src={arrowDownConnected} alt="arrowDown" /></span>
      ) : (
        <button disabled={isConnecting} onClick={handleConnectWallet}>
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </header>
  );
}

export default Header;
