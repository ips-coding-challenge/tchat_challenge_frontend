import React, { useState, useContext } from "react";
import client from "../client";
import { Link, useHistory } from "react-router-dom";
import { store, SET_USER } from "../store/store";
import Layout from "../components/Layout";
import Input from "../components/Input";
import lock from "../assets/lock.svg";
import person from "../assets/person.svg";
import mail from "../assets/mail.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import LoadingButton from "../components/LoadingButton";
import SocialIcons from "../components/SocialIcons";
import { useSnackbar } from "notistack";

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password must match"),
});

const Login = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    console.log(`Data`, data);
    setServerErrors(null);
    setLoading(true);
    try {
      await client.service("users").create(data);
      enqueueSnackbar("Registration complete. You can now login", {
        variant: "success",
        autoHideDuration: 3000,
      });
      history.push("/login");
    } catch (e) {
      console.log(`Error`, e);
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
    <Layout>
      <div className="flex md:items-center justify-center min-h-screen w-full md:py-4">
        <div className="flex flex-col md:border md:border-mGray2 rounded-mXl max-w-mWidth p-8 md:px-12">
          <h1 className="mb-6">MyChat</h1>
          <p className="text-mWhite font-bold text-xl mb-4">
            Join thousands of learners from around the world
          </p>
          <p className="mb-8">
            Master web development by making real-life projects. There are
            multiple paths for you to choose
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              name="name"
              type="text"
              placeholder="Your name"
              icon={person}
              ref={register}
              error={errors.name?.message || serverErrors?.name}
            />
            <Input
              name="email"
              type="email"
              placeholder="Your email"
              icon={mail}
              required
              ref={register}
              error={errors.email?.message || serverErrors?.email}
            />
            <Input
              name="password"
              type="password"
              placeholder="Your password"
              icon={lock}
              required
              ref={register}
              error={errors.password?.message || serverErrors?.password}
            />
            <Input
              name="password_confirmation"
              type="password"
              placeholder="Confirm your password"
              icon={lock}
              required
              ref={register}
              error={
                errors.password_confirmation?.message ||
                serverErrors?.password_confirmation
              }
            />

            <LoadingButton
              text="Start chatting now"
              type="submit"
              loading={loading}
            />
            {/* <button
              type="submit"
              className="w-full mt-2 mb-8 bg-mBlue text-white rounded-mSm py-3 px-3 hover:bg-blue-600 transition-colors duration-200"
            >
              Start chatting now
            </button> */}
          </form>

          <p className="text-mGray text-center text-sm">
            or continue with these social profile
          </p>

          <SocialIcons />

          <p className="mt-4 text-center">
            Already registered?{" "}
            <Link className="text-mBlue" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
