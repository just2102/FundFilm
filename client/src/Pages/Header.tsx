import {
  disconnectRequest,
  setAccount,
  setContract,
  setCurrency,
  setNetwork,
  setProvider,
  setSigner,
} from "../Redux/web3slice";
// import contractArtifact from "../../../web3/artifacts/contracts/FundFilm.sol/FundFilm.json"
import contractArtifact from "../FundFilm.json";
import { ethers } from "ethers";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.css";
import arrowDownConnected from "../assets/arrowdown-connected.svg";
import logoutIcon from "../assets/logout.svg";
import copyIcon from "../assets/copy.svg";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { useCustomSelector } from "../Redux/useCustomSelector";
import { useCustomDispatch } from "../Redux/useCustomDispatch";
Modal.setAppElement("#root");

function Header() {
  const account = useCustomSelector().web3.account;
  const dispatch = useCustomDispatch();
  const navigate = useNavigate();

  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [copySnackbarOpen, setCopySnackbarOpen] = useState(false);

  const handleCopy = () => {
    if (!account) return;
    setCopySnackbarOpen(true);
    navigator.clipboard.writeText(account);
  };
  const handleDisconnect = async () => {
    await dispatch(disconnectRequest());
  };

  const [isConnecting, setIsConnecting] = useState(false);
  const [networkModalOpen, setNetworkModalOpen] = useState(false);
  const handleNetworkModalOpen = async () => {
    const currentlySelectedNetwork = await window.ethereum.networkVersion;
    if (currentlySelectedNetwork === "137") {
      setChosenNetwork(networks.polygon);
    }
    if (currentlySelectedNetwork === "11155111") {
      setChosenNetwork(networks.sepolia);
    }
    setNetworkModalOpen(true);
  };
  const [chosenNetwork, setChosenNetwork] = useState<null | string>(null);
  const networks = {
    sepolia: "0xfAEF615930a30B512374d729949707BD5d355326",
    // 0xfe3f36a621901bE6E19227f7A121cB14DdC739Ae
    polygon: "0x3bC6720b8CbF472B7672b52b1F00E140511Ba4C1",
    // 0x7140978f40D30a9ef284A7C998e236B42E9fdFA8
  };
  const handleSelectNetwork = async (network: string) => {
    if (network === networks.polygon) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }],
        });
      } catch (error) {
        const handledError = error as any;
        if (handledError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x89",
                  chainName: "Polygon Mainnet",
                  nativeCurrency: {
                    name: "MATIC",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  rpcUrls: ["https://polygon-rpc.com/"],
                  blockExplorerUrls: ["https://polygonscan.com/"],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    } else if (network === networks.sepolia) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      } catch (error) {
        // todo: handle errors better
        const handledError = error as any;
        if (handledError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://rpc.sepolia.org/"],
                  blockExplorerUrls: ["https://explorer.sepolia.org/"],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }
        console.error(error);
      }
    }
    setChosenNetwork(network);
  };
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
          contractArtifact.abi,
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
      setNetworkModalOpen(false);
    }
  };

  function sliceAddress(address: string) {
    const first = address.substring(0, 4);
    const second = "...";
    const third = address.substring(address.length - 4);
    return first + second + third;
  }

  return (
    <header>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={copySnackbarOpen}
        autoHideDuration={1500}
        onClose={() => setCopySnackbarOpen(false)}
        message="Address copied"
      ></Snackbar>
      <NavLink to={"/campaigns"}>Campaigns</NavLink>
      <NavLink to={"/mycampaigns"}>My Campaigns</NavLink>
      <NavLink to={"/about"}>About</NavLink>
      {account ? (
        <>
          <span onClick={() => setToggleDrawer(!toggleDrawer)}>
            {sliceAddress(account)}
            <img src={arrowDownConnected} alt="arrowDown" />
            {toggleDrawer && (
              <div className="drawer">
                <div onClick={handleCopy} className="drawer_action copy">
                  <img src={copyIcon} alt="copyAddress" />
                  <span>Copy</span>
                </div>

                <div
                  onClick={handleDisconnect}
                  className="drawer_action logout"
                >
                  <img src={logoutIcon} alt="logout" />
                  <span>Disconnect</span>
                </div>
              </div>
            )}
          </span>
        </>
      ) : (
        <>
          <button disabled={isConnecting} onClick={handleNetworkModalOpen}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </button>
          <Modal
            onRequestClose={() => setNetworkModalOpen(false)}
            style={customStyles}
            isOpen={networkModalOpen}
          >
            <div className="networkModal">
              <h2>Choose a network</h2>
              <div className="networks">
                <div onClick={() => handleSelectNetwork(networks.sepolia)}>
                  <span
                    id={
                      chosenNetwork ===
                      "0xfAEF615930a30B512374d729949707BD5d355326"
                        ? "chosen"
                        : ""
                    }
                  >
                    Sepolia (testnet)
                  </span>
                </div>
                <div onClick={() => handleSelectNetwork(networks.polygon)}>
                  <span
                    id={
                      chosenNetwork ===
                      "0x3bC6720b8CbF472B7672b52b1F00E140511Ba4C1"
                        ? "chosen"
                        : ""
                    }
                  >
                    Polygon (mainnet)
                  </span>
                </div>
              </div>
              <button
                className={!chosenNetwork ? "button_disabled" : ""}
                disabled={!chosenNetwork}
                onClick={handleConnectWallet}
              >
                Connect
              </button>
            </div>
          </Modal>
        </>
      )}
    </header>
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

export default Header;
