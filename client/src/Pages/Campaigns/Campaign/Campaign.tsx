import { useEffect, useState } from "react";
import Modal from "react-modal";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

import { Snackbar, Alert } from "@mui/material";
import { ethers } from "ethers";
import editIcon from "src/assets/edit.svg";
import { fetchCampaignById, withdrawFromCampaign } from "src/Redux/campaignSlice";
import { useCustomDispatch } from "src/Redux/useCustomDispatch";
import { useCustomSelector } from "src/Redux/useCustomSelector";
import { ContractInteraction } from "src/types/ethersTypes";
import { unixToDate } from "src/utils/unixToDate";

import DonateModal from "./CampaignModals/Donate";
import EditModal from "./CampaignModals/Edit";
import ExtendModal from "./CampaignModals/Extend";

import CurrencyLogo from "../../common/CurrencyLogo";
import Preloader from "../../common/Preloader";
import styles from "../Campaigns.module.css";

const Campaign = () => {
  const { campaignId } = useParams();
  const campaign = useCustomSelector().campaigns.currentlyDisplayedCampaign;
  const account = useCustomSelector().web3.account;

  const contract = useCustomSelector().web3.contract;
  const isOwner = account === campaign?.owner;

  const hasEnded = Number(campaign?.deadline) * 1000 < Date.now() || campaign?.hasWithdrawn === true;

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const dispatch = useCustomDispatch();
  let title, description, video, image, hasWithdrawn, target, amountCollected, deadline;
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

  const [withdrawError, setWithdrawError] = useState<string | undefined>(undefined);
  const onWithdraw = async () => {
    if (contract && campaignId) {
      try {
        const response = await dispatch(withdrawFromCampaign({ contract, campaignId: Number(campaignId) }));
        const parsedResponsePayload = JSON.parse(JSON.stringify(response.payload)) as ContractInteraction;
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
      // todo: compare campaignId from event with current campaignId
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
        <div className={styles.campaign}>
          <div className={styles.campaign_title}>
            <h2>{title}</h2>
            {isOwner && (
              <button onClick={onEdit}>
                {" "}
                <img
                  src={editIcon}
                  alt=''
                />{" "}
              </button>
            )}
          </div>
          <div className={styles.campaign_description}>{description}</div>
          <div className={styles.campaign_image}>
            {image && (
              <img
                src={image}
                alt='image'
              />
            )}
          </div>
          <div className={styles.campaign_video}>
            {video && (
              <ReactPlayer
                url={video}
                controls={true}
              />
            )}
          </div>

          <div className={styles.campaign_meta}>
            <div className={`${styles.campaign_meta_item} ${styles.deadline}`}>
              Deadline: {deadline}
              {isOwner && <button onClick={onExtend}>EXTEND</button>}
            </div>
            <div className={`${styles.campaign_meta_item} ${styles.target}`}>
              Target: {target}
              <CurrencyLogo></CurrencyLogo>
            </div>
            <div className={`${styles.campaign_meta_item} ${styles.raised}`}>
              Raised: {amountCollected}
              <CurrencyLogo></CurrencyLogo>
            </div>
          </div>

          <div className={styles.campaign_donate}>{!isOwner && <button onClick={onDonate}>DONATE</button>}</div>
          {isOwner && !hasWithdrawn && (
            <div className={styles.campaign_withdraw}>
              <button onClick={onWithdraw}>WITHDRAW</button>
              {withdrawError && <span className='form_error'>{withdrawError}</span>}
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
        <Alert severity='info'>{snackbar.message}</Alert>
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
