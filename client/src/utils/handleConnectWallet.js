// create a hook to connect wallet
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setAccount, setContract, setProvider, setSigner } from "../store/slices/web3Slice";
// import { ethers } from "ethers";
// import contractArtifact from "../contracts/Contract.json";
// import { useState } from "react";
//

// const handleConnectWallet = async () => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const [isConnecting, setIsConnecting] = useState(false);

//     try {
//       setIsConnecting(true);
//       if (window.ethereum) {
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = web3Provider.getSigner();
//         const account = await signer.getAddress();
//         const contract = new ethers.Contract("0xC85e2cDE16bdaC9eb3c3AA0fDa4A67a4a78CD5E0", contractArtifact.abi, signer)
//         dispatch(setProvider(web3Provider));
//         dispatch(setAccount(account));
//         dispatch(setSigner(signer));
//         dispatch(setContract(contract));
//         navigate("/campaigns")
//       } else throw new Error("Metamask not found");
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setIsConnecting(false);
//     }
// };
