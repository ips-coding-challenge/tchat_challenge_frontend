import React, { useContext, useState, useEffect } from "react";
import { store } from "../../store/store";
import { useHistory } from "react-router-dom";
import SidebarChannels from "./SidebarChannels";
import SidebarUsers from "./SidebarUsers";

const Sidebar = ({ channel }) => {
  const {
    state: { user, showChannelsList },
  } = useContext(store);
  const history = useHistory();

  const closeSidebar = () => {
    document.querySelector(".sidebar").classList.remove("open");
  };
  return (
    <div className="sidebar fixed inset-0 lg:block bg-transparent lg:w-mSidebar lg:relative">
      <div
        onClick={closeSidebar}
        className="w-8 h-8 flex justify-center items-center fixed lg:hidden font-bold text-xl bg-mBlue rounded text-white z-50"
        style={{ top: "0", left: "325px" }}
      >
        X
      </div>
      <div className="flex flex-col w-mSidebar h-full overflow-hidden bg-darkBg">
        {showChannelsList && <SidebarChannels></SidebarChannels>}
        {!showChannelsList && <SidebarUsers></SidebarUsers>}
        {/* Current User */}
        <div
          onClick={() => history.push("/profile")}
          style={{ borderTop: "1px solid #ffffff30" }}
          className="group flex items-center flex-none h-20 bg-darkerBg px-4 cursor-pointer hover:bg-mBlue transition-colors duration-300"
        >
          <img className="w-10 h-10 rounded mr-6 " src={user.avatar} />
          <div className="flex justify-between items-center w-full">
            <span className="group-hover:text-black font-bold">
              {user.name}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="24px"
              height="24px"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
