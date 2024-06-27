import { useDispatch } from "react-redux";
import styles from "./app.module.css";
import Header from "./Pages/Header";
import Sidebar from "./Pages/Sidebar";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Profile from "./Pages/Profile";
import MyCampaigns from "./Pages/MyCampaigns/MyCampaigns";
import Campaigns from "./Pages/Campaigns/Campaigns";
import Campaign from "./Pages/Campaigns/Campaign";
import About from "./Pages/About/About";
import Preloader from "./Pages/common/Preloader";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
// import contractArtifact from "./FundFilm.json";
import { FundFilmAbi } from "./abi/FundFilm";
import {
  setAccount,
  setContract,
  setCurrency,
  setNetwork,
  setProvider,
  setSigner,
} from "./Redux/web3slice";
import { networks, networksToCurrencies } from "./utils/const";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isConnecting, setIsConnecting] = useState(false);

  const [chosenNetwork, setChosenNetwork] = useState<string | null>(null);

  const isOnCampaigns =
    (location.pathname === "/mycampaigns" ||
      location.pathname === "/campaigns") &&
    chosenNetwork !== null;

  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true);
      if (window.ethereum) {
        if (!chosenNetwork) throw new Error("Network not chosen");

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = web3Provider.getSigner();
        const account = await signer.getAddress();
        const contract = new ethers.Contract(
          chosenNetwork,
          FundFilmAbi,
          signer
        );
        dispatch(setProvider(web3Provider));
        dispatch(setAccount(account));
        dispatch(setSigner(signer));
        dispatch(setContract(contract));
        dispatch(setNetwork(chosenNetwork.toUpperCase()));
        dispatch(setCurrency(networksToCurrencies[chosenNetwork]));
        navigate("/campaigns");
      } else throw new Error("Metamask not found");
    } catch (error) {
      console.error(error);
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    const detectNetwork = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await web3Provider.getNetwork();
        switch (network.chainId) {
          case 137:
            setChosenNetwork(networks.Polygon);
            break;
          case 11155111:
            setChosenNetwork(networks.Sepolia);
            break;
          case 534352:
            setChosenNetwork(networks.Scroll);
            break;
          default:
            dispatch(setNetwork("UNSUPPORTED"));
            throw new Error("Unsupported network");
        }
      }
    };
    detectNetwork().then(() => {
      handleConnectWallet();
    });
  }, [chosenNetwork]);

  if (isConnecting) return <Preloader loadingText={"Please wait..."} />;
  else
    return (
      <div className={`${styles.app} ${isOnCampaigns ? styles.rows : ""}`}>
        <Sidebar></Sidebar>
        <Header></Header>
        <Routes>
          <Route path="profile" element={<Profile />}></Route>
          <Route path="campaigns" element={<Campaigns />}></Route>
          <Route path="/campaigns/:campaignId" element={<Campaign />}></Route>

          <Route path="mycampaigns" element={<MyCampaigns />}></Route>

          <Route path="about" element={<About />}></Route>
        </Routes>
      </div>
    );
}

export default App;
