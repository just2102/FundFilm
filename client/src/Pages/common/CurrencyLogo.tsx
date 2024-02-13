import ethLogo from "../../assets/eth.svg";
import maticLogo from "../../assets/matic.svg";
import { useCustomSelector } from "../../Redux/useCustomSelector";

const CurrencyLogo = () => {
  const currency = useCustomSelector().web3.currency;

  return (
    <>
      {currency === "ETH" && (
        <img className="currencyLogo" id="ethLogo" src={ethLogo} alt="eth" />
      )}
      {currency === "MATIC" && (
        <img
          className="currencyLogo"
          id="maticLogo"
          src={maticLogo}
          alt="matic"
        />
      )}
    </>
  );
};

export default CurrencyLogo;
