import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { ethers } from "ethers";
import { CampaignToAdd, startCampaign } from "src/Redux/campaignSlice";
import { fetchMyCampaigns } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";
import { ContractInteraction } from "src/types/ethersTypes";

import styles from "./AddCampaignModal.module.css";

import EthInput from "../EthInput/EthInput";
import Preloader from "../Preloader";

export type FormValues = {
  title: string;
  description: string;
  target: string;
  deadline: string;
  image: string;
  video: string;
  imageOption: string;
};

function AddCampaignModal() {
  const dispatch = useCustomDispatch();
  const {
    register,
    handleSubmit,
    // watch,
    formState: { errors },
  } = useForm<FormValues>();
  const contract = useCustomSelector().web3.contract;
  const provider = useCustomSelector().web3.provider;
  const account = useCustomSelector().web3.account;

  const { isStartingCampaign } = useCustomSelector().campaigns;

  const [currentBalance, setCurrentBalance] = useState(0);
  const getCurrentBalance = async () => {
    if (!provider || !account) return;
    setCurrentBalance(parseFloat(ethers.utils.formatEther(await provider.getBalance(account))));
  };

  const [imageOption, setImageOption] = useState("link");

  const [addCampaignError, setAddCampaignError] = useState<string | undefined>(undefined);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!contract || !account) return;
    const { title, description, image, video, target, deadline } = data;
    const targetParsed = ethers.utils.parseEther(target);
    const deadlineParsed = Date.parse(deadline) / 1000;
    const campaignToAdd: CampaignToAdd = {
      title,
      description,
      target: targetParsed,
      deadline: deadlineParsed,
      image,
      video,
    };
    const response = await dispatch(startCampaign({ contract, campaignToAdd }));
    console.log(response);
    const ethersResponse = response.payload as ContractInteraction;
    if (ethersResponse.error) {
      setAddCampaignError(ethersResponse.reason);
    }
    if (response.meta.requestStatus === "fulfilled") {
      dispatch(fetchMyCampaigns({ contract, account }));
    }
  };

  useEffect(() => {
    if (contract) {
      getCurrentBalance();
    }
  }, [account, contract, provider]);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.addCampaignModal}
      >
        <h3>Start a campaign!</h3>
        <div className={styles.addCampaign_fieldColumn}>
          <label htmlFor='title'>Your movie title</label>
          <input
            {...register("title", {
              required: { value: true, message: "This field is required" },
              maxLength: {
                value: 40,
                message: "Title cannot be longer than 40 symbols",
              },
            })}
            id='title'
            type='text'
            placeholder='Ascending...'
          />
          {errors.title && <span className='form_error'>{errors.title.message?.toString()}</span>}
        </div>

        <div className={styles.addCampaign_fieldColumn}>
          <label htmlFor='description'>Describe your movie</label>
          <textarea
            cols={30}
            rows={10}
            {...register("description", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 30,
                message: "Please write at least 30 symbols",
              },
              maxLength: {
                value: 1000,
                message: "Description cannot be longer than 1000 symbols",
              },
            })}
            name='description'
            id='description'
          ></textarea>
          {errors.description && <span className='form_error'>{errors.description.message?.toString()}</span>}
        </div>

        <EthInput
          label={"target"}
          message={"Campaign target"}
          register={register}
          errors={errors}
          currentBalance={currentBalance}
          balanceCheck={false}
        />

        <div className={styles.addCampaign_fieldColumn}>
          <label htmlFor='deadline'>Deadline (choose carefully!)</label>
          <input
            {...register("deadline", {
              required: { value: true, message: "This field is required" },
            })}
            id='deadline'
            type='date'
          />
          {errors.deadline && <span className='form_error'>{errors.deadline.message?.toString()}</span>}
        </div>

        <div className={styles.addCampaign_fieldColumn}>
          <fieldset id='newCampaignImage'>
            <legend>Image options</legend>
            <input
              {...register("imageOption")}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                setImageOption(target.value);
              }}
              id='linkImage'
              type='radio'
              name='imageOption'
              value='link'
              checked={imageOption === "link"}
            />
            <label htmlFor='linkImage'>Link</label>

            {imageOption === "upload" && (
              <input
                disabled
                {...register("image")}
                id='image'
                type='file'
              />
            )}

            {imageOption === "link" && (
              <input
                {...register("image")}
                id='image'
                type='text'
                placeholder='https://...'
              />
            )}
          </fieldset>
          {errors.image && <span className='form_error'>{errors.image.message?.toString()}</span>}
        </div>

        <div className={styles.addCampaign_fieldColumn}>
          <label htmlFor='video'>Teaser link (optional)</label>
          <input
            {...register("video")}
            id='video'
            type='text'
          />
        </div>
        {isStartingCampaign && <Preloader />}

        {addCampaignError && <span className='form_error'>{addCampaignError}</span>}
        <button
          disabled={isStartingCampaign}
          className={isStartingCampaign ? "button_disabled" : "button_enabled"}
          type='submit'
        >
          Start!
        </button>
      </form>
    </>
  );
}

export default AddCampaignModal;
