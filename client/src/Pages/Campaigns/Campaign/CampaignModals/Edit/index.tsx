import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useParams } from "react-router-dom";

import { ethers } from "ethers";
import styles from "src/Pages/common/AddCampaignModal/AddCampaignModal.module.css";
import EthInput from "src/Pages/common/EthInput";
import Preloader from "src/Pages/common/Preloader";
import { CampaignData, editCampaign } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";
import { fromReadableAmount } from "src/utils/conversion";

interface EditFormValues {
  title: string;
  description: string;
  target: string;
  image: string;
  video: string;
  imageOption: string;
}

const EditModal = () => {
  const dispatch = useCustomDispatch();
  const contract = useCustomSelector().web3.contract;
  const isTransacting = useCustomSelector().campaigns.isTransacting;
  const campaign = useCustomSelector().campaigns.currentlyDisplayedCampaign;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormValues>();
  const { campaignId } = useParams();
  const [imageOption, setImageOption] = useState("link");
  const onSubmit: SubmitHandler<EditFormValues> = async (data) => {
    if (!contract || !campaignId) {
      return;
    }
    const { title, target, description, image, video } = data;

    const targetParsed = fromReadableAmount(target);

    const newCampaignData: CampaignData = {
      title,
      description,
      targetParsed,
      image,
      video,
    };
    dispatch(editCampaign({ contract, campaignId, newCampaignData }));
  };
  if (!campaign) return <h2>Connect your wallet first!</h2>;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.addCampaignModal}
      >
        <h3>Edit "{campaign.title}"</h3>
        <div className={styles.addCampaign_fieldColumn}>
          <label htmlFor='title'>New title</label>
          <input
            defaultValue={campaign.title}
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
          <label htmlFor='description'>New description</label>
          <textarea
            defaultValue={campaign.description}
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
          message={"New target"}
          register={register}
          errors={errors}
          balanceCheck={false}
          defaultValue={parseFloat(ethers.utils.formatEther(campaign.target))}
        />

        <div className={styles.addCampaign_fieldColumn}>
          <fieldset id='newCampaignImage'>
            <legend>Image options</legend>
            {/* <input 
                  {...register("imageOption",)}
                  onClick={(e)=>{setImageOption(e.target.value)}}
                  id="uploadImage" type="radio"
                  name="imageOption" value="upload"
                  checked={imageOption==="upload"}
                  />
                  <label htmlFor="uploadImage">Upload (temporarily N/A)</label> */}

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
                defaultValue={campaign.image}
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
        {isTransacting && <Preloader />}
        <button
          disabled={isTransacting}
          className={isTransacting ? "button_disabled" : "button_enabled"}
          type='submit'
        >
          Edit!
        </button>
      </form>
    </>
  );
};

export default EditModal;
