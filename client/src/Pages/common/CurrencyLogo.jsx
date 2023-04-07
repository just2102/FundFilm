import { useSelector } from "react-redux";
import ethLogo from "../../assets/eth.svg";
import maticLogo from "../../assets/matic.svg";

const CurrencyLogo = () => {
  const currency = useSelector((state) => state.web3.currency);

  return (
    <>
      {currency === "ETH" && <img className="currencyLogo" id="ethLogo" src={ethLogo} alt="eth" />}
      {currency === "MATIC" && <img className="currencyLogo" id="maticLogo" src={maticLogo} alt="matic" />}
    </>
  );
};

export default CurrencyLogo;
