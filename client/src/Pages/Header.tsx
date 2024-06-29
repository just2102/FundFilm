import { useState } from "react";
import { NavLink } from "react-router-dom";

import arrowDownConnected from "src/assets/arrowdown-connected.svg";
import copyIcon from "src/assets/copy.svg";
import logoutIcon from "src/assets/logout.svg";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";
import { disconnectRequest } from "src/Redux/web3slice";

import SnackbarNotification from "./common/SnackbarNotification";
import styles from "./Header.module.css";
import WalletConnection from "./WalletConnection";

const Header = () => {
  const account = useCustomSelector().web3.account;
  const dispatch = useCustomDispatch();

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

  const sliceAddress = (address: string) => {
    const first = address.substring(0, 4);
    const second = "...";
    const third = address.substring(address.length - 4);

    return first + second + third;
  };

  return (
    <header className={styles.header}>
      <SnackbarNotification
        open={copySnackbarOpen}
        onClose={() => setCopySnackbarOpen(false)}
        message='Address copied'
      />
      <nav className={styles.nav}>
        <NavLink to={"/campaigns"}>Campaigns</NavLink>
        <NavLink to={"/mycampaigns"}>My Campaigns</NavLink>
        <NavLink to={"/about"}>About</NavLink>
      </nav>
      {account ? (
        <>
          <div
            className={styles.connectWallet}
            onClick={() => setToggleDrawer(!toggleDrawer)}
          >
            {sliceAddress(account)}
            <img
              className={styles.arrowDown}
              src={arrowDownConnected}
              alt='arrowDown'
            />
            {toggleDrawer && (
              <div className={styles.drawer}>
                <div
                  onClick={handleCopy}
                  className={styles.drawer_action}
                >
                  <img
                    src={copyIcon}
                    alt='copyAddress'
                  />
                  <span>Copy</span>
                </div>
                <div
                  onClick={handleDisconnect}
                  className={styles.drawer_action}
                >
                  <img
                    src={logoutIcon}
                    alt='logout'
                  />
                  <span>Disconnect</span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <WalletConnection />
      )}
    </header>
  );
};

export default Header;
