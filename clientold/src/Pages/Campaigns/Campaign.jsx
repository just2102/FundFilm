import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ethLogo from "../../assets/ethlogo.svg"
import { donateToCampaign, extendDeadline, fetchCampaignById, withdrawFromCampaign } from "../../Redux/campaignSlice";
import "../../styles/Campaigns.css"
import { unixToDate } from "../../utils/unixToDate";
import Preloader from "../common/Preloader";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import EthInput from "../common/EthInput";
import ReactPlayer from "react-player";
import { dateToUnix } from "../../utils/dateToUnix";

const DonateModal = () => {
    const dispatch = useDispatch();

    const contract = useSelector(state=>state.web3.contract)
    const account = useSelector(state=>state.web3.account)
    const provider = useSelector(state=>state.web3.provider)
    const isDonating = useSelector(state=>state.campaigns.isDonating)

    const [currentBalance, setCurrentBalance] = useState(0)
    const [balanceError, setBalanceError] = useState(null)
    
    const getCurrentBalance = async() => {
        setCurrentBalance(ethers.utils.formatEther(await provider.getBalance(account)))
    }

    const { register, handleSubmit, watch, formState: { errors, balance } } = useForm();
    const {campaignId} = useParams()
    const campaign = useSelector(state=>state.campaigns.currentlyDisplayedCampaign);
    const onSubmit = async(data) => {
        const amount = ethers.utils.parseEther(data.amount);
        if (data.amount>currentBalance) {
            setBalanceError("Insufficient funds")
            return;
        }
        setBalanceError(null)

        if (contract && campaignId) {
            dispatch(donateToCampaign({
                contract:contract, 
                campaignId:campaignId, 
                amount:amount}));
        }
    }

    useEffect(()=>{
        getCurrentBalance();
    },[contract, account])
    return ( 
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="donateModal">
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
            balanceCheck={true}></EthInput>
            {/* {balanceError && 
            <div className="form_error">
                <span>{balanceError}</span>
                <span>{`Current balance: ${currentBalance} ETH`}</span>
            </div>} */}
            {isDonating && <Preloader></Preloader>}
            <button disabled={isDonating} 
            className={isDonating ? 'button_disabled' : 'button_enabled'} 
            type="submit">Donate</button>
        </form>
        </>
     );
}

const ExtendModal = () => {
    const dispatch = useDispatch();
    const contract = useSelector(state=>state.web3.contract)
    const account = useSelector(state=>state.web3.account)
    const provider = useSelector(state=>state.web3.provider)
    const isTransacting = useSelector(state=>state.campaigns.isTransacting)

    const [currentBalance, setCurrentBalance] = useState(0)
    const [balanceError, setBalanceError] = useState(null)
    const getCurrentBalance = async() => {
        setCurrentBalance(ethers.utils.formatEther(await provider.getBalance(account)))
    }

    const campaign = useSelector(state=>state.campaigns.currentlyDisplayedCampaign);

    const { register, handleSubmit, watch, formState: { errors, balance } } = useForm();
    const {campaignId} = useParams()
    const onSubmit = async(data) => {
        const newDeadline = dateToUnix(data.newDeadline);
        const response = await dispatch(extendDeadline({contract, campaignId, newDeadline}))
        if (response.payload.error) {
            setBalanceError(response.payload.reason)
            return;
        }
    }
    const [expectedCost, setExpectedCost] = useState(null);
    
    const getExpectedCost = () => {
        const campaignTarget = ethers.utils.formatEther(campaign.target);
        // count expected cost (service fee is 2% of campaign target)
        const cost = campaignTarget*0.02;
        setExpectedCost(cost)
    }

    useEffect(()=>{
        getCurrentBalance();
        getExpectedCost();
    },[contract, account])
    return (
    <>
        <form onSubmit={handleSubmit(onSubmit)} className="donateModal">
            <h3>Extend campaign</h3>
            <h4>{campaign.title}</h4>
            <span>Current deadline: {unixToDate(campaign.deadline)}</span>
            <p><label htmlFor="newDeadline">New deadline </label>
            <input type="date" {...register("newDeadline")} /></p>
            {isTransacting && <Preloader></Preloader>}
            <button disabled={isTransacting} 
            className={isTransacting ? 'button_disabled' : 'button_enabled'} 
            type="submit">Extend</button>
            <span className="form_error">This transaction is not free! Service fee included</span>
            <span className="form_error">Expected cost: {expectedCost} ETH</span>
            {balanceError && <span className="form_error">{balanceError}</span>}
        </form>
    </>
    );
}

const Campaign = ({isOwner}) => {
    const {campaignId} = useParams()
    const campaign = useSelector(state=>state.campaigns.currentlyDisplayedCampaign);
    const account = useSelector(state=>state.web3.account)
    const contract = useSelector(state=>state.web3.contract)
    isOwner = account === campaign?.owner;
    const dispatch = useDispatch();
    let owner, title, description, video, image, hasWithdrawn, target, amountCollected, deadline;
    if (campaign) {
        owner = campaign.owner;
        title = campaign.title;
        description = campaign.description;
        video = campaign.video;
        image = campaign.image;
        hasWithdrawn = campaign.hasWithdrawn;
        target = ethers.utils.formatEther(campaign.target);
        amountCollected = ethers.utils.formatEther(campaign.amountCollected)
        deadline = unixToDate(campaign.deadline)
    }

    const [donateModalOpen, setDonateModalOpen] = useState(false);
    const onDonate = () => {
        setDonateModalOpen(true);
    }

    const [withdrawError, setWithdrawError] = useState(null);
    const onWithdraw = async() => {
        if (contract && campaignId) {
            const response = await dispatch(withdrawFromCampaign({contract, campaignId}))
            if (response.payload.error) {
                setWithdrawError(response.payload.reason)
            }
            console.log(response)
        }
    }

    const [extendModalOpen, setExtendModalOpen] = useState(false);
    const onExtend = () => {
        setExtendModalOpen(true);
    }


    useEffect(()=>{
        dispatch(fetchCampaignById({contract, campaignId}))
    },[campaignId, contract])
    return (
    <>
        {!campaign && <Preloader/> }
        {campaign && 
        <div className="campaign">
            <div className="campaign_title">{title}</div>
            <div className="campaign_description">{description}</div>
            <div className="campaign_image">{image && <img src={image} alt="image" />}</div>
            <div className="campaign_video">
                {video && <ReactPlayer url={video} controls={true}/> }
            </div>

            <div className="campaign_meta">
                <div className="campaign_meta_item deadline">Deadline: {deadline} 
                    {isOwner && <button onClick={onExtend}>EXTEND</button>}
                </div>
                <div className="campaign_meta_item target">Target: {target} <img id="ethlogo" src={ethLogo} alt="eth" /></div>
                <div className="campaign_meta_item raised">Raised: {amountCollected} <img id="ethlogo" src={ethLogo} alt="eth" /> </div>
            </div>

            <div className="campaign_donate">
                <button onClick={onDonate}>DONATE</button>
            </div>
            {(isOwner && !hasWithdrawn) &&
            <div className="campaign_withdraw">
                <button onClick={onWithdraw}>WITHDRAW</button>
                {withdrawError && <span className="form_error">{withdrawError}</span> }
            </div>}

        </div>
        }
        <Modal 
        style={customStyles}
        isOpen={donateModalOpen} 
        onRequestClose={()=>setDonateModalOpen(false)}>
            <DonateModal/>
        </Modal>

        <Modal
        style={customStyles}
        isOpen={extendModalOpen}
        onRequestClose={()=>setExtendModalOpen(false)}>
            <ExtendModal/>
        </Modal>
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
 
export default Campaign;