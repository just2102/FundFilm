import { useDispatch } from "react-redux";
import "./app.css";
import Header from "./Pages/Header";
import Sidebar from "./Pages/Sidebar";
import { Routes, Route, useNavigate } from "react-router-dom";
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

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isConnecting, setIsConnecting] = useState(false);

  const networks = {
    sepolia: "0xfAEF615930a30B512374d729949707BD5d355326",
    // 0xfe3f36a621901bE6E19227f7A121cB14DdC739Ae
    polygon: "0x3bC6720b8CbF472B7672b52b1F00E140511Ba4C1",
    // 0x7140978f40D30a9ef284A7C998e236B42E9fdFA8
  };

  const [chosenNetwork, setChosenNetwork] = useState<string | null>(null);

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
        dispatch(
          setNetwork(chosenNetwork === networks.polygon ? "POLYGON" : "SEPOLIA")
        );
        dispatch(
          setCurrency(chosenNetwork === networks.polygon ? "MATIC" : "ETH")
        );
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
            setChosenNetwork(networks.polygon);
            break;
          case 11155111:
            setChosenNetwork(networks.sepolia);
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
      <div className="App">
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
