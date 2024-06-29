import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";

import { ethers } from "ethers";
import styles from "src/Pages/Campaigns/Campaigns.module.css";
import EthInput from "src/Pages/common/EthInput/EthInput";
import Preloader from "src/Pages/common/Preloader";
import { donateToCampaign } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";

export interface DonateFormValues {
  amount: string;
}

const DonateModal = () => {
  const dispatch = useCustomDispatch();

  const contract = useCustomSelector().web3.contract;
  const account = useCustomSelector().web3.account;
  const provider = useCustomSelector().web3.provider;
  const isDonating = useCustomSelector().campaigns.isDonating;

  const [currentBalance, setCurrentBalance] = useState(0);
  const [balanceError, setBalanceError] = useState("");

  const getCurrentBalance = async () => {
    if (!provider || !account) return;
    setCurrentBalance(parseFloat(ethers.utils.formatEther(await provider.getBalance(account))));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonateFormValues>();
  const { campaignId } = useParams();
  const campaign = useCustomSelector().campaigns.currentlyDisplayedCampaign;
  const onSubmit: SubmitHandler<DonateFormValues> = async (data) => {
    const amount = ethers.utils.parseEther(data.amount);
    if (parseFloat(data.amount) > currentBalance) {
      setBalanceError("Insufficient funds");

      return;
    }
    setBalanceError("");

    if (contract && campaignId) {
      dispatch(
        donateToCampaign({
          contract: contract,
          campaignId: campaignId,
          amount: amount,
        }),
      );
    }
  };

  useEffect(() => {
    getCurrentBalance();
  }, [contract, account]);
  if (!campaign) return null;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.donateModal}
      >
        <div>
          <h3>Donate to campaign</h3>
          <h4>{campaign.title}</h4>
        </div>
        <EthInput
          label={"amount"}
          message={"Amount "}
          register={register}
          errors={errors}
          currentBalance={currentBalance}
          balanceCheck={true}
        />
        {isDonating && <Preloader />}
        <button
          disabled={isDonating}
          className={isDonating ? "button_disabled" : "button_enabled"}
          type='submit'
        >
          Donate
        </button>
      </form>
    </>
  );
};

export default DonateModal;
