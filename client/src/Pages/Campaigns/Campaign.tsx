import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  donateToCampaign,
  editCampaign,
  extendDeadline,
  fetchCampaignById,
  withdrawFromCampaign,
} from "../../Redux/campaignSlice";
import "../../styles/Campaigns.css";
import { unixToDate } from "../../utils/unixToDate";
import Preloader from "../common/Preloader";
import Modal from "react-modal";
import { SubmitHandler, useForm } from "react-hook-form";
import EthInput from "../common/EthInput";
import ReactPlayer from "react-player";
import { dateToUnix } from "../../utils/dateToUnix";
import editIcon from "../../assets/edit.svg";
import CurrencyLogo from "../common/CurrencyLogo";
import { Snackbar, Alert } from "@mui/material";
import { useCustomSelector } from "../../Redux/useCustomSelector";
import { useCustomDispatch } from "../../Redux/useCustomDispatch";
import { ContractInteraction } from "../../types/ethersTypes";

type DonateFormValues = {
  amount: string;
};

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
    setCurrentBalance(
      parseFloat(ethers.utils.formatEther(await provider.getBalance(account)))
    );
  };

  const {
    register,
    handleSubmit,
    // watch,
    formState: {
      errors,
      //  balance
    },
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
        })
      );
    }
  };

  useEffect(() => {
    getCurrentBalance();
  }, [contract, account]);
  if (!campaign) return null;
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
          balanceCheck={true}
        />
        {isDonating && <Preloader />}
        <button
          disabled={isDonating}
          className={isDonating ? "button_disabled" : "button_enabled"}
          type="submit"
        >
          Donate
        </button>
      </form>
    </>
  );
};

type ExtendFormValues = {
  newDeadline: string;
};
const ExtendModal = () => {
  const dispatch = useCustomDispatch();

  const contract = useCustomSelector().web3.contract;
  const account = useCustomSelector().web3.account;
  const provider = useCustomSelector().web3.provider;
  const isTransacting = useCustomSelector().campaigns.isTransacting;

  const [currentBalance, setCurrentBalance] = useState(0);
  const [balanceError, setBalanceError] = useState<string | undefined>(
    undefined
  );
  const getCurrentBalance = async () => {
    if (!provider || !account) return;
    setCurrentBalance(
      parseFloat(ethers.utils.formatEther(await provider.getBalance(account)))
    );
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
    const response = await dispatch(
      extendDeadline({ contract, campaignId, newDeadline, costToExtend })
    );
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
    const campaignTarget = parseFloat(
      ethers.utils.formatEther(campaign.target)
    );
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
      <form onSubmit={handleSubmit(onSubmit)} className="donateModal">
        <h3>Extend campaign</h3>
        <h4>{campaign.title}</h4>
        <span>Current deadline: {unixToDate(Number(campaign.deadline))}</span>
        <p>
          <label htmlFor="newDeadline">New deadline </label>
          <input type="date" {...register("newDeadline")} />
        </p>
        {isTransacting && <Preloader></Preloader>}
        <button
          disabled={isTransacting}
          className={isTransacting ? "button_disabled" : "button_enabled"}
          type="submit"
        >
          Extend
        </button>
        <span className="form_error">
          This transaction is not free! Service fee included (2% of the target)
        </span>
        <span className="form_error">Expected cost: {expectedCost} ETH</span>
        {balanceError && <span className="form_error">{balanceError}</span>}
      </form>
    </>
  );
};

type EditFormValues = {
  title: string;
  description: string;
  target: string;
  image: string;
  video: string;
  imageOption: string;
};
const EditModal = () => {
  const dispatch = useCustomDispatch();
  const contract = useCustomSelector().web3.contract;
  const isTransacting = useCustomSelector().campaigns.isTransacting;
  const campaign = useCustomSelector().campaigns.currentlyDisplayedCampaign;

  const {
    register,
    handleSubmit,
    // watch,
    formState: {
      errors,
      //  balance
    },
  } = useForm<EditFormValues>();
  const { campaignId } = useParams();
  const [imageOption, setImageOption] = useState("link");
  const onSubmit: SubmitHandler<EditFormValues> = async (data) => {
    if (!contract || !campaignId) {
      return;
    }
    const { title, target, description, image, video } = data;
    const targetParsed = ethers.utils.parseEther(target);
    // deadline = Date.parse(deadline) / 1000;
    const newCampaignData = {
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
      <form onSubmit={handleSubmit(onSubmit)} className="addCampaignModal">
        <h3>Edit "{campaign.title}"</h3>
        <div className="addCampaign_fieldColumn">
          <label htmlFor="title">New title</label>
          <input
            defaultValue={campaign.title}
            {...register("title", {
              required: { value: true, message: "This field is required" },
              maxLength: {
                value: 40,
                message: "Title cannot be longer than 40 symbols",
              },
            })}
            id="title"
            type="text"
            placeholder="Ascending..."
          />
          {errors.title && (
            <span className="form_error">
              {errors.title.message?.toString()}
            </span>
          )}
        </div>

        <div className="addCampaign_fieldColumn">
          <label htmlFor="description">New description</label>
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
            name="description"
            id="description"
          ></textarea>
          {errors.description && (
            <span className="form_error">
              {errors.description.message?.toString()}
            </span>
          )}
        </div>

        <EthInput
          label={"target"}
          message={"New target"}
          register={register}
          errors={errors}
          balanceCheck={false}
          defaultValue={parseFloat(ethers.utils.formatEther(campaign.target))}
        />

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
              {...register("imageOption")}
              onClick={(e) => {
                const target = e.target as HTMLInputElement;
                setImageOption(target.value);
              }}
              id="linkImage"
              type="radio"
              name="imageOption"
              value="link"
              checked={imageOption === "link"}
            />
            <label htmlFor="linkImage">Link</label>

            {imageOption === "upload" && (
              <input disabled {...register("image")} id="image" type="file" />
            )}

            {imageOption === "link" && (
              <input
                defaultValue={campaign.image}
                {...register("image")}
                id="image"
                type="text"
                placeholder="https://..."
              />
            )}
          </fieldset>
          {errors.image && (
            <span className="form_error">
              {errors.image.message?.toString()}
            </span>
          )}
        </div>

        <div className="addCampaign_fieldColumn">
          <label htmlFor="video">Teaser link (optional)</label>
          <input
            defaultValue={campaign.video}
            {...register("video")}
            id="video"
            type="text"
          />
        </div>
        {isTransacting && <Preloader />}
        <button
          disabled={isTransacting}
          className={isTransacting ? "button_disabled" : "button_enabled"}
          type="submit"
        >
          Edit!
        </button>
      </form>
    </>
  );
};

const Campaign = () => {
  const { campaignId } = useParams();
  const campaign = useCustomSelector().campaigns.currentlyDisplayedCampaign;
  const account = useCustomSelector().web3.account;
  // const currency = useCustomSelector().web3.currency;

  const contract = useCustomSelector().web3.contract;
  const isOwner = account === campaign?.owner;

  const hasEnded =
    Number(campaign?.deadline) * 1000 < Date.now() ||
    campaign?.hasWithdrawn === true;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const dispatch = useCustomDispatch();
  let title,
    description,
    video,
    image,
    hasWithdrawn,
    target,
    amountCollected,
    deadline;
  if (campaign) {
    // owner = campaign.owner;
    title = campaign.title;
    description = campaign.description;
    video = campaign.video;
    image = campaign.image;
    hasWithdrawn = campaign.hasWithdrawn;
    target = ethers.utils.formatEther(campaign.target);
    amountCollected = ethers.utils.formatEther(campaign.amountCollected);
    deadline = unixToDate(Number(campaign.deadline));
  }

  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const onDonate = () => {
    setDonateModalOpen(true);
  };

  const [withdrawError, setWithdrawError] = useState<string | undefined>(
    undefined
  );
  const onWithdraw = async () => {
    if (contract && campaignId) {
      try {
        const response = await dispatch(
          withdrawFromCampaign({ contract, campaignId: Number(campaignId) })
        );
        const parsedResponsePayload = JSON.parse(
          JSON.stringify(response.payload)
        ) as ContractInteraction;
        if (!parsedResponsePayload.error) {
          setWithdrawError(undefined);
        } else {
          setWithdrawError(parsedResponsePayload.error.message);
        }
      } catch (error) {
        console.log("error: ", error);
        const handledError = error as Error;
        setWithdrawError(handledError.message);
      }
    }
  };

  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const onExtend = () => {
    setExtendModalOpen(true);
  };

  const [editModalOpen, setEditModalOpen] = useState(false);
  const onEdit = () => {
    if (hasEnded) {
      setSnackbar({
        open: true,
        message: "This campaign has already finished!",
      });
      return;
    }
    setEditModalOpen(true);
  };

  if (contract) {
    contract.on("CampaignDeadlineExtended", () => {
      // todo: check campaignId from event with current campaignId
      if (campaignId) {
        dispatch(fetchCampaignById({ contract, campaignId }));
        setExtendModalOpen(false);
      }
    });
  }
  if (contract) {
    contract.on("CampaignEdited", (campaignId, newCampaignData, event) => {
      dispatch(fetchCampaignById({ contract, campaignId }));
      setEditModalOpen(false);
    });
  }

  useEffect(() => {
    if (contract && campaignId) {
      dispatch(fetchCampaignById({ contract, campaignId }));
    }
  }, [campaignId, contract]);
  if (!contract) return null;
  return (
    <>
      {!campaign && <Preloader />}
      {campaign && (
        <div className="campaign">
          <div className="campaign_title">
            <h2>{title}</h2>
            {isOwner && (
              <button onClick={onEdit}>
                {" "}
                <img src={editIcon} alt="" />{" "}
              </button>
            )}
          </div>
          <div className="campaign_description">{description}</div>
          <div className="campaign_image">
            {image && <img src={image} alt="image" />}
          </div>
          <div className="campaign_video">
            {video && <ReactPlayer url={video} controls={true} />}
          </div>

          <div className="campaign_meta">
            <div className="campaign_meta_item deadline">
              Deadline: {deadline}
              {isOwner && <button onClick={onExtend}>EXTEND</button>}
            </div>
            <div className="campaign_meta_item target">
              Target: {target}
              <CurrencyLogo></CurrencyLogo>
            </div>
            <div className="campaign_meta_item raised">
              Raised: {amountCollected}
              <CurrencyLogo></CurrencyLogo>
            </div>
          </div>

          <div className="campaign_donate">
            {!isOwner && <button onClick={onDonate}>DONATE</button>}
          </div>
          {isOwner && !hasWithdrawn && (
            <div className="campaign_withdraw">
              <button onClick={onWithdraw}>WITHDRAW</button>
              {withdrawError && (
                <span className="form_error">{withdrawError}</span>
              )}
            </div>
          )}
        </div>
      )}
      <Modal
        style={customStyles}
        isOpen={donateModalOpen}
        onRequestClose={() => setDonateModalOpen(false)}
      >
        <DonateModal />
      </Modal>

      <Modal
        style={customStyles}
        isOpen={extendModalOpen}
        onRequestClose={() => setExtendModalOpen(false)}
      >
        <ExtendModal />
      </Modal>

      <Modal
        style={customStyles}
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
      >
        <EditModal />
      </Modal>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={1500}
        onClose={() => setSnackbar({ open: false, message: "" })}
        open={snackbar.open}
      >
        <Alert severity="info">{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

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
