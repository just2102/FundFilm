import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";

import { ethers } from "ethers";
import Preloader from "src/Pages/common/Preloader";
import { extendDeadline } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";
import { ContractInteraction } from "src/types/ethersTypes";
import { dateToUnix } from "src/utils/dateToUnix";
import { unixToDate } from "src/utils/unixToDate";

interface ExtendFormValues {
  newDeadline: string;
}

const ExtendModal = () => {
  const dispatch = useCustomDispatch();

  const contract = useCustomSelector().web3.contract;
  const account = useCustomSelector().web3.account;
  const provider = useCustomSelector().web3.provider;
  const isTransacting = useCustomSelector().campaigns.isTransacting;

  const [currentBalance, setCurrentBalance] = useState(0);
  const [balanceError, setBalanceError] = useState<string | undefined>(undefined);
  const getCurrentBalance = async () => {
    if (!provider || !account) return;
    setCurrentBalance(parseFloat(ethers.utils.formatEther(await provider.getBalance(account))));
  };

  const campaign = useCustomSelector().campaigns.currentlyDisplayedCampaign;

  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors, balance },
  } = useForm<ExtendFormValues>();
  const { campaignId } = useParams();
  const onSubmit: SubmitHandler<ExtendFormValues> = async (data) => {
    if (!contract || !campaignId || !data.newDeadline || !expectedCost) {
      return;
    }
    const newDeadline = dateToUnix(data.newDeadline);
    const costToExtend = ethers.utils.parseEther(expectedCost.toString());
    const response = await dispatch(extendDeadline({ contract, campaignId, newDeadline, costToExtend }));
    const isSuccessResponse = response.payload === undefined;
    if (isSuccessResponse) return;

    const ethersResponsePayload = response.payload as ContractInteraction;
    if (ethersResponsePayload.error) {
      setBalanceError(ethersResponsePayload.reason);

      return;
    }
  };
  const [expectedCost, setExpectedCost] = useState<null | number>(null);

  const getExpectedCost = () => {
    if (!campaign) return;
    const campaignTarget = parseFloat(ethers.utils.formatEther(campaign.target));
    // count expected cost (service fee is 2% of campaign target)
    const cost = campaignTarget * 0.02;
    setExpectedCost(cost);
  };

  useEffect(() => {
    getCurrentBalance();
    getExpectedCost();
  }, [contract, account]);

  if (!campaign) return null;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='donateModal'
      >
        <h3>Extend campaign</h3>
        <h4>{campaign.title}</h4>
        <span>Current deadline: {unixToDate(Number(campaign.deadline))}</span>
        <p>
          <label htmlFor='newDeadline'>New deadline </label>
          <input
            type='date'
            {...register("newDeadline")}
          />
        </p>
        {isTransacting && <Preloader></Preloader>}
        <button
          disabled={isTransacting}
          className={isTransacting ? "button_disabled" : "button_enabled"}
          type='submit'
        >
          Extend
        </button>
        <span className='form_error'>This transaction is not free! Service fee included (2% of the target)</span>
        <span className='form_error'>Expected cost: {expectedCost} ETH</span>
        {balanceError && <span className='form_error'>{balanceError}</span>}
      </form>
    </>
  );
};

export default ExtendModal;
