import { useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";

import { ethers } from "ethers";
import editIcon from "src/assets/edit.svg";
import { Modal } from "src/Pages/common/Modal";
import SnackbarNotification from "src/Pages/common/SnackbarNotification";
import { withdrawFromCampaign } from "src/Redux/campaignSlice";
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
import { useRefetchCampaign } from "../hooks/useRefetchCampaign";

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

  useRefetchCampaign(campaignId);

  if (!contract) return null;

  const deadlineText = hasWithdrawn ? `Finished: ${deadline}` : `Deadline: ${deadline}`;

  return (
    <>
      {!campaign && <Preloader />}
      {campaign && (
        <div className={styles.campaign}>
          <div className={styles.campaign_title}>
            <h2>{title}</h2>
            {isOwner && (
              <button onClick={onEdit}>
                <img
                  src={editIcon}
                  alt=''
                />
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
              {deadlineText}
              {isOwner && !hasWithdrawn && <button onClick={onExtend}>EXTEND</button>}
            </div>
            <div className={`${styles.campaign_meta_item} ${styles.target}`}>
              Target: {target}
              <CurrencyLogo />
            </div>
            <div className={`${styles.campaign_meta_item} ${styles.raised}`}>
              Raised: {amountCollected}
              <CurrencyLogo />
            </div>
          </div>

          {!isOwner && !hasWithdrawn && (
            <div className={styles.campaign_donate}>
              <button onClick={onDonate}>DONATE</button>
            </div>
          )}
          {isOwner && !hasWithdrawn && (
            <div className={styles.campaign_withdraw}>
              <button onClick={onWithdraw}>WITHDRAW</button>
              {withdrawError && <span className='form_error'>{withdrawError}</span>}
            </div>
          )}
        </div>
      )}
      <Modal
        isOpen={donateModalOpen}
        onRequestClose={() => setDonateModalOpen(false)}
      >
        <DonateModal />
      </Modal>

      <Modal
        isOpen={extendModalOpen}
        onRequestClose={() => setExtendModalOpen(false)}
      >
        <ExtendModal />
      </Modal>

      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
      >
        <EditModal />
      </Modal>

      <SnackbarNotification
        open={snackbar.open}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
        severity='info'
      />
    </>
  );
};

export default Campaign;
