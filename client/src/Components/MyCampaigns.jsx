import React from "react";
import Modal from "react-modal";
import { useState } from "react";
import "../styles/MyCampaigns.css";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";


function AddCampaignModal() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const contract = useSelector(state=>state.web3.contract)
    const provider = useSelector(state=>state.web3.provider)
    const onSubmit = async(data) => {
      // const blockNumber = await contract.provider.getBlockNumber();
      // const timestampOfCurrentBlock = await contract.provider.getBlock(blockNumber).timestamp;
      // console.log(timestampOfCurrentBlock)
      try {
        let {title, description, target, deadline, image} = data;
        image = "https://res.cloudinary.com/do6ggmadv/image/upload/v1677472930/zds1qkmvjjsh32pwsqe5.png"
        const result = await contract.startCampaign(
          title,
          description,
          target,
          Date.parse(deadline) / 1000,
          image
        )
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="addCampaignModal">
        <h3>Add a campaign!</h3>
            <label htmlFor="title">Your movie title:</label>
            <input 
            {...register("title", 
            {required: {value:true, message: 'This field is required'},
            maxLength: {value:40, message: "Title cannot be longer than 40 symbols"}})}
            id="title" type="text" placeholder="Ascending..." />
            <span className="form_error">{errors.title && errors.title.message}</span>

            <label htmlFor="description">Describe your movie:</label>
            <textarea 
            {...register("description", 
            {required: {value:true, message: 'This field is required'},
            minLength: {value:30, message: 'Please write at least 30 symbols'},
            maxLength: {value:1000, message: "Description cannot be longer than 1000 symbols"}})} 
            name="description" id="description"></textarea>
            <span className="form_error">{errors.description && errors.description.message}</span>

            <label htmlFor="target">Campaign target: </label>
            <div>
            <input 
            {...register("target", 
            {required: {value:true, message: 'This field is required'},
            min: {value: 0.0049, message: "Should be at least 0.005"},
            max: {value: 50000, message: "Please provide a correct value"}})}
            step="any" id="target" type="number"  placeholder="50..."/></div>
            <span className="form_error">{errors.target && errors.target.message}</span>

            <label htmlFor="deadline">Deadline: </label>
            <input 
            {...register("deadline", 
            {required: {value:true, message: 'This field is required'},
            })} 
            id="deadline" type="date" />
            <span className="form_error">{errors.deadline && errors.deadline.message}</span>

            <label htmlFor="image">Upload an image: </label>
            <input 
            {...register("image", 
            {required: {value:true, message: 'This field is required'}})} 
            id="image" type="file" />
            <span className="form_error">{errors.image && errors.image.message}</span>

            <input type="submit" value={"Add!"} />
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
      maxHeight: "70vh"
    },
  };

function MyCampaigns() {
  const account = useSelector(state=>state.web3.account)
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="mycampaigns">
      {account 
      ? <button onClick={() => setModalIsOpen(!modalIsOpen)}>
        Start a campaign
      </button>
      : <h3>Connect wallet to add a new campaign!</h3> }
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={customStyles}
      >
        <AddCampaignModal />
      </Modal>
    </div>
  );
}

export default MyCampaigns;
