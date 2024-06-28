import ethLogo from "src/assets/eth.svg";
import maticLogo from "src/assets/matic.svg";
import { useCustomSelector } from "src/Redux/useCustomSelector";

const CurrencyLogo = () => {
  const currency = useCustomSelector().web3.currency;

  return (
    <>
      {currency === "ETH" && (
        <img
          className='currencyLogo'
          id='ethLogo'
          src={ethLogo}
          alt='eth'
        />
      )}
      {currency === "MATIC" && (
        <img
          className='currencyLogo'
          id='maticLogo'
          src={maticLogo}
          alt='matic'
        />
      )}
    </>
  );
};

export default CurrencyLogo;
