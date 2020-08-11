import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import BasicInput from "../BasicInput";
import client from "../../client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import LoadingButton from "../../components/LoadingButton";
import { store, SET_USER } from "../../store/store";
import FadeIn from "react-fade-in";
import { useSnackbar } from "notistack";

const schema = yup.object().shape({
  name: yup.string(),
  email: yup.string().email(),
  phone: yup
    .string()
    .test("phone", "Your phone should have this format xxxxxxxxxx", (value) => {
      if (value.length > 0) {
        return yup
          .string()
          .matches(/\d{10}/)
          .max(10)
          .isValidSync(value);
      }
      return true;
    }),
  bio: yup.string(),
  password: yup
    .string()
    .test(
      "password",
      "Your password must be at least 6 characters",
      (value, schema) => {
        console.log(`Value`, value);
        console.log(`Schema`, schema);
        if (value.length > 0) {
          return yup.string().min(6).isValidSync(value);
        }
        return true;
      }
    ),
});

const ProfileForm = ({ user, setEditMode }) => {
  const { dispatch } = useContext(store);
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const updateProfile = async (data) => {
    setLoading(true);
    setServerErrors(false);
    console.log(`Data`, data);

    Object.keys(data).forEach((k) => {
      console.log(k);
      if (data[k].trim() === "") {
        delete data[k];
      }
    });

    console.log(`new Data`, data);

    try {
      const updatedUser = await client.service("users").patch(null, data);
      setLoading(false);
      setEditMode(false);

      dispatch({ type: SET_USER, payload: updatedUser });
      enqueueSnackbar("Profile updated", {
        variant: "success",
        autoHideDuration: 2000,
      });
    } catch (e) {
      setLoading(false);
      if (e.errors.hasOwnProperty("email")) {
        const serverError = { ...e.errors, email: e.errors.message };
        console.log(`serverError`, serverError);
        setServerErrors({
          ...e.errors,
          email: e.message.replace("email:", ""),
        });
      } else {
        setServerErrors(e.errors);
      }
    }
  };

  return (
    <FadeIn>
      <div className="px-4 mx-auto">
        <div style={{ maxWidth: "800px" }} className="mx-auto">
          <a
            className="block text-mBlue cursor-pointer hover:text-blue-700 mb-4"
            onClick={() => setEditMode(false)}
          >
            &larr; Back
          </a>

          <div className="p-4 md:p-8 md:border md:border-mGray md:rounded-mL ">
            <div className="max-w-mWidth">
              <h1 className="font-bold text-3xl mb-2 text-mGray2">
                Change info
              </h1>
              <p className="text-mGray2 mb-10">
                Change will be reflected to every services
              </p>

              {/* Change photo */}
              <div className="flex items-center">
                <img className="h-16 w-16 rounded-mL" src={user.avatar} />
                <p className="ml-10 font-bold">CHANGE PHOTO</p>
              </div>

              {/* Form */}
              <form className="mt-8" onSubmit={handleSubmit(updateProfile)}>
                <BasicInput
                  type="text"
                  name="name"
                  label="Name"
                  value={user.name}
                  placeholder="Enter your name..."
                  ref={register}
                  error={errors.name?.message}
                />
                <BasicInput
                  type="textarea"
                  name="bio"
                  value={user.bio}
                  label="Bio"
                  placeholder="Enter your bio..."
                  ref={register}
                  error={errors.bio?.message}
                />
                <BasicInput
                  type="text"
                  name="phone"
                  label="Phone"
                  value={user.phone}
                  placeholder="0456263585"
                  ref={register}
                  error={errors.phone?.message}
                />
                <BasicInput
                  type="email"
                  name="email"
                  label="Email"
                  value={user.email}
                  placeholder="Enter your email..."
                  ref={register}
                  error={errors.email?.message || serverErrors?.email}
                />
                <BasicInput
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="***********"
                  ref={register}
                  error={errors.password?.message}
                />

                <LoadingButton
                  type="submit"
                  loading={loading}
                  // className="bg-mBlue hover:bg-blue-700 mt-6"
                  text="Save"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default ProfileForm;
