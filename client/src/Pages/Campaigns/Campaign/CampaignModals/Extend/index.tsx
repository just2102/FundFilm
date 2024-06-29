import { useState, useEffect, useMemo } from "react";
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

export interface ExtendFormValues {
  newDeadline: string;
}

const serviceFeeFloat = 0.02;

const ExtendModal = () => {
  const dispatch = useCustomDispatch();

  const contract = useCustomSelector().web3.contract;
  const currency = useCustomSelector().web3.currency;
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

  const { register, handleSubmit } = useForm<ExtendFormValues>();
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

  const expectedCost = useMemo(() => {
    if (!campaign) return null;
    const campaignTarget = parseFloat(ethers.utils.formatEther(campaign.target));
    const cost = campaignTarget * serviceFeeFloat;

    return cost;
  }, [campaign]);

  const notEnoughBalance = useMemo(() => {
    if (!expectedCost) return false;

    return currentBalance < expectedCost;
  }, [currentBalance, expectedCost]);

  useEffect(() => {
    getCurrentBalance();
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
          disabled={isTransacting || notEnoughBalance}
          className={isTransacting || notEnoughBalance ? "button_disabled" : "button_enabled"}
          type='submit'
        >
          Extend
        </button>
        <span className='form_error'>This transaction is not free! Service fee included (2% of the target)</span>
        <span className='form_error'>
          Expected cost: {expectedCost} {currency}
        </span>
        {notEnoughBalance && (
          <span className='form_error'>
            Current balance: {currentBalance.toFixed(5)} {currency}
          </span>
        )}
        {balanceError && <span className='form_error'>{balanceError}</span>}
      </form>
    </>
  );
};

export default ExtendModal;
