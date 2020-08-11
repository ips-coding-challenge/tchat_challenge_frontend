import React from "react";
import Button from "../Button";
import Block from "./Block";
import FadeIn from "react-fade-in";

const ProfileShow = ({ user, setEditMode }) => {
  return (
    <FadeIn>
      <div className="container mx-auto md:max-w-mWidth mt-8">
        <h1 className="font-bold text-3xl mb-2 text-mGray2 text-center">
          Personal info
        </h1>
        <p className="text-mGray2 mb-10 text-center">
          Basic info, like your name and photo{" "}
        </p>

        <div className="md:border md:border-mGray md:rounded-mL">
          <Block>
            <div className="mr-4">
              <h3 className="text-xl font-bold text-mGray2">Profile</h3>
              <p className="text-mGray2">
                Some info may be visible to other people
              </p>
            </div>
            <Button
              className="flex-start border border-mGray2 hover:bg-mGray hover:border-mGray"
              text="Edit"
              onClick={() => setEditMode(true)}
            />
          </Block>

          <Block>
            <div className="text-xl text-mGray">PHOTO</div>
            <img
              className="h-16 w-16 rounded-mL"
              src={user.avatar}
              alt="avatar"
            />
          </Block>
          <Block>
            <div className="text-xl text-mGray">NAME</div>
            <p className="text-white">{user.name}</p>
          </Block>
          <Block>
            <div className="text-xl text-mGray">BIO</div>
            <p className="text-white">{user.bio}</p>
          </Block>
          <Block>
            <div className="text-xl text-mGray">EMAIL</div>
            <p className="text-white">{user.email}</p>
          </Block>
          <Block border="none">
            <div className="text-xl text-mGray">PASSWORD</div>
            <p className="text-white">*********</p>
          </Block>
        </div>
      </div>
    </FadeIn>
  );
};

export default ProfileShow;
