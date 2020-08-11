import React, { useState, useContext } from "react";
import client from "../client";
import { Link, useHistory } from "react-router-dom";
import { store, SET_USER } from "../store/store";
import Input from "../components/Input";
import Layout from "../components/Layout";
import lock from "../assets/lock.svg";
import mail from "../assets/mail.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers";
import * as yup from "yup";
import LoadingButton from "../components/LoadingButton";
import SocialIcons from "../components/SocialIcons";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const Login = () => {
  const { dispatch } = useContext(store);
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const login = async (data) => {
    setServerErrors(null);
    setLoading(true);
    console.log(`Data`, data);
    try {
      const user = await client.authenticate({
        strategy: "local",
        email: data.email,
        password: data.password,
      });
      dispatch({ type: SET_USER, payload: user.user });
      history.push("/");
    } catch (e) {
      setServerErrors(e);
      setLoading(false);
      console.log(`Login e`, e);
    }
  };

  return (
    <Layout>
      <div className="flex md:items-center justify-center min-h-screen w-full">
        <div className="flex flex-col md:border md:border-mGray2 rounded-mXl max-w-mWidth p-8 md:px-12">
          <h1 className="mb-6">MyChat</h1>
          <p className="text-mWhite font-bold text-xl mb-4">
            Join thousands of learners from around the world
          </p>
          <p className="mb-8">
            Master web development by making real-life projects. There are
            multiple paths for you to choose
          </p>

          <form onSubmit={handleSubmit(login)}>
            {serverErrors && (
              <p className="text-red-500 mb-4">{serverErrors.message}</p>
            )}
            <Input
              name="email"
              type="email"
              placeholder="Your email"
              icon={mail}
              ref={register}
              error={errors.email?.message}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Your password"
              icon={lock}
              ref={register}
              error={errors.password?.message}
              required
            />

            <LoadingButton text="Start chatting now" loading={loading} />
          </form>

          <p className="text-mGray text-center text-sm">
            or continue with these social profile
          </p>

          <SocialIcons />

          <p className="mt-4 text-center">
            Not registered yet?{" "}
            <Link className="text-mBlue" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
