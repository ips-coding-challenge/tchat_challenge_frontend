import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { store, SET_USER } from "../store/store";
import client from "../client";
import Layout from "../components/Layout";
import ProfileShow from "../components/Profile/ProfileShow";
import ProfileForm from "../components/Profile/ProfileForm";
import Button from "../components/Button";

const Profile = () => {
  const { state, dispatch } = useContext(store);
  const history = useHistory();
  const [editMode, setEditMode] = useState(false);
  const signOut = async () => {
    // Need to delete user from connectedUsers
    client.service("connected-users").remove(null, {});

    // Remove the token from local storage and redirect to the login page
    localStorage.removeItem("feathers-jwt");
    dispatch({ type: SET_USER, payload: null });
    history.push("/login");
  };
  return (
    <Layout>
      <div className="pb-12 max-w-mWidthContainer mx-auto">
        <header className="flex items-center justify-between p-4">
          <div
            className="font-bold text-xl text-white cursor-pointer"
            onClick={() => history.push("/")}
          >
            MyTchat
          </div>
          <Button
            text="Sign out"
            className="border border-mGray2 hover:bg-red-500 hover:border-red-500"
            onClick={signOut}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                width="18px"
                height="18px"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
              </svg>
            }
          />
        </header>
        {editMode ? (
          <ProfileForm user={state.user} setEditMode={setEditMode} />
        ) : (
          <ProfileShow user={state.user} setEditMode={setEditMode} />
        )}
      </div>
    </Layout>
  );
};

export default Profile;
