import Modal from "react-modal";

import { networks } from "src/utils/const";

import styles from "./NetworkModal.module.css";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  chosenNetwork: string | null;
  setChosenNetwork: (network: string) => void;
  handleConnectWallet: () => void;
}

const NetworkModal = ({ isOpen, onRequestClose, chosenNetwork, setChosenNetwork, handleConnectWallet }: Props) => {
  const handleSelectNetwork = async (network: string) => {
    if (network === networks.Polygon) {
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
                  rpcUrls: ["https://polygon-pokt.nodies.app/"],
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
    } else if (network === networks.Sepolia) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      } catch (error) {
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
    } else if (network === networks.Scroll) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x82750" }],
        });
      } catch (error) {
        const handledError = error as any;
        if (handledError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x82750",
                  chainName: "Scroll",
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                  rpcUrls: ["https://scroll-mainnet.public.blastapi.io"],
                  blockExplorerUrls: ["https://scrollscan.com/"],
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

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={{
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
      }}
    >
      <div className={styles.networkModal}>
        <h2>Choose a network</h2>
        <div className={styles.networks}>
          {Object.keys(networks).map((network) => (
            <div
              key={network}
              className={`${styles.network} ${chosenNetwork === networks[network] ? styles.chosen : ""}   `}
              onClick={() => handleSelectNetwork(networks[network])}
            >
              <span>{network}</span>
            </div>
          ))}
        </div>

        <button
          className={!chosenNetwork ? styles.button_disabled : ""}
          disabled={!chosenNetwork}
          onClick={handleConnectWallet}
        >
          Connect
        </button>
      </div>
    </Modal>
  );
};

export default NetworkModal;
