import React, { useEffect } from "react";
import Modal from "react-modal";
import { useState } from "react";
import "../../styles/Campaigns.css";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import EthInput from "../common/EthInput";
import { fetchMyCampaigns, startCampaign } from "../../Redux/campaignSlice";
import CampaignLinks from "../Campaigns/CampaignLinks";
import Preloader from "../common/Preloader";


function AddCampaignModal() {
    const dispatch = useDispatch();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const contract = useSelector(state=>state.web3.contract)
    const provider = useSelector(state=>state.web3.provider)

    const campaigns = useSelector(state=>state.campaigns.campaigns)
    const myCampaigns = useSelector(state=>state.campaigns.myCampaigns)
    const isStartingCampaign = useSelector(state=>state.campaigns.isStartingCampaign)
    const account = useSelector(state=>state.web3.account)
    const [currentBalance, setCurrentBalance] = useState(0)
    const getCurrentBalance = async() => {
        setCurrentBalance(ethers.utils.formatEther(await provider.getBalance(account)))
    }

    const [imageOption, setImageOption] = useState("link")
    const onSubmit = async(data) => {
        let {title, description, target, deadline, image, video} = data;
        target = ethers.utils.parseEther(target);
        deadline = Date.parse(deadline) / 1000;
        const campaignToAdd = {
          title,
          description,
          target,
          deadline,
          image,
          video
        }
        const response = await dispatch(startCampaign({contract,campaignToAdd}))
        if (response.payload) {
          dispatch(fetchMyCampaigns({contract, account}))
        }
    }

  useEffect(()=>{
    if (contract) {
      getCurrentBalance();
    }
  },[account, contract, provider])
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="addCampaignModal">
        <h3>Start a campaign!</h3>
            <div className="addCampaign_fieldColumn">
              <label htmlFor="title">Your movie title</label>
              <input 
              {...register("title", 
              {required: {value:true, message: 'This field is required'},
              maxLength: {value:40, message: "Title cannot be longer than 40 symbols"}})}
              id="title" type="text" placeholder="Ascending..." />
              {errors.title && <span className="form_error">{errors.title.message}</span>}
            </div>

            <div className="addCampaign_fieldColumn">
              <label htmlFor="description">Describe your movie</label>
              <textarea cols={30} rows={10}
              {...register("description", 
              {required: {value:true, message: 'This field is required'},
              minLength: {value:30, message: 'Please write at least 30 symbols'},
              maxLength: {value:1000, message: "Description cannot be longer than 1000 symbols"}})} 
              name="description" id="description"></textarea>
              {errors.description && <span className="form_error">{errors.description.message}</span>}
            </div>

            <EthInput 
            label={"target"} 
            message={"Campaign target"} 
            register={register} 
            errors={errors}
            currentBalance={currentBalance}
            balanceCheck={false}></EthInput>

            <div className="addCampaign_fieldColumn">
              <label htmlFor="deadline">Deadline (choose carefully!)</label>
              <input 
              {...register("deadline", 
              {required: {value:true, message: 'This field is required'},
              })} 
              id="deadline" type="date" />
              {errors.deadline && <span className="form_error">{errors.deadline.message}</span>}
            </div>

            <div className="addCampaign_fieldColumn">
              <fieldset id="newCampaignImage">
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
                {...register("imageOption",)}
                onClick={(e)=>{setImageOption(e.target.value)}}
                id="linkImage" type="radio"
                name="imageOption" value="link"
                checked={imageOption==="link"}
                />
                <label htmlFor="linkImage">Link</label>

                {imageOption==="upload" && 
                <input
                disabled
                {...register("image")}
                id="image" type="file" /> }

                {imageOption==="link" &&
                <input
                {...register("image")}
                id="image" type="text" placeholder="https://..." /> }
              </fieldset>
              {errors.image && <span className="form_error">{errors.image.message}</span>}
            </div>

            <div className="addCampaign_fieldColumn">
              <label htmlFor="video">Teaser link (optional)</label>
              <input
              {...register("video")}
              id="video" type="text" />
            </div>
            {isStartingCampaign && <Preloader/>}
            <button disabled={isStartingCampaign} 
            className={isStartingCampaign ? 'button_disabled' : 'button_enabled'} 
            type="submit">Start!</button>
      </form>
    </>
  );
}
const customStyles = {
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
};


function MyCampaigns() {
  const account = useSelector(state=>state.web3.account)
  const contract = useSelector(state=>state.web3.contract)
  const myCampaigns = useSelector(state=>state.campaigns.myCampaigns)
  const isFetching = useSelector(state=>state.campaigns.isFetching)

  const dispatch = useDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);


  useEffect(()=>{
      dispatch(fetchMyCampaigns({contract, account}));
  },[account])
  return (
    <>
    <div className="campaigns my">

      {account 
      ? <button onClick={() => setModalIsOpen(!modalIsOpen)}>
        Start a campaign
      </button>
      : <h3>Connect your wallet to start a new campaign!</h3> }
      
      {isFetching && <Preloader loadingText={'Looking for your campaigns...'}/>}
      {myCampaigns && <CampaignLinks campaigns={myCampaigns}/>}
 
    </div>
    <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <AddCampaignModal />
    </Modal>
    </>
  );
}

export default MyCampaigns;
