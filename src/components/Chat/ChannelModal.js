import React, { useState, useEffect, useContext } from "react";
import Modal from "../Modal";
import BasicInput from "../BasicInput";
import LoadingButton from "../LoadingButton";
import * as yup from "yup";
import client from "../../client";
import { store, SET_CURRENT_CHANNEL } from "../../store/store";

const schema = yup.object().shape({
  name: yup.string().min(3).required(),
  description: yup.string().min(10).required(),
});

const ChannelModal = ({ showModal, setShowModal }) => {
  const { dispatch } = useContext(store);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const addChannel = async (e) => {
    e.preventDefault();
    setErrors({});
    console.log(`Data`, { name, description });
    try {
      const data = await schema.validate({ name, description });

      await client.service("channels").create(data);

      setShowModal(false);
    } catch (e) {
      if (e.name === "ValidationError") {
        let formErrors = {};
        formErrors[e.params.path] = { message: e.message };
        console.log(`formErrors`, formErrors);
        setErrors(() => formErrors);
      }
    }
    // schema.validate({ name, description }).catch((e) => {
    //   console.log(`Errors`, e);

    // });
  };

  const modalContent = (
    <form onSubmit={addChannel}>
      <BasicInput
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="name"
        error={errors.name?.message}
      />
      <BasicInput
        type="textarea"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        name="description"
        error={errors.description?.message}
      />
      <div className="flex justify-end">
        <LoadingButton
          // onClick={() => addChannel()}
          loading={loading}
          type="submit"
          className="bg-mBlue"
          text="Save"
        />
      </div>
    </form>
  );
  return (
    <Modal
      isVisible={showModal}
      title="NEW CHANNEL"
      content={modalContent}
      onClose={() => setShowModal(false)}
    />
  );
};

export default ChannelModal;
