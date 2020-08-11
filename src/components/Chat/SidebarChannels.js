import React, { useContext, useState } from "react";
import client from "../../client";
import {
  store,
  SET_CURRENT_CHANNEL,
  SHOW_CHANNELS_LIST,
} from "../../store/store";
import Input from "../Input";
import search from "../../assets/search.svg";
import ChannelModal from "../Chat/ChannelModal";
import { useEffect } from "react";

const SidebarChannels = () => {
  const {
    state: { channels, currentChannel },
    dispatch,
  } = useContext(store);

  const [filtered, setFiltered] = useState(channels);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log(`Channels`, channels);
    setFiltered(() => channels);
  }, [channels]);

  const changeChannel = async (channel) => {
    dispatch({ type: SET_CURRENT_CHANNEL, payload: channel });
    dispatch({ type: SHOW_CHANNELS_LIST, payload: false });
    // Close sidebar on mobile
    const sidebar = document.querySelector(".sidebar");
    if (sidebar.classList.contains("open")) {
      sidebar.classList.remove("open");
    }
    try {
      await client
        .service("connected-users")
        .create({ channelId: channel._id });
    } catch (e) {
      console.log(`E`, e.message);
    }
  };

  const transformName = (name) => {
    const splitted = name.split(" ");
    let final = "";
    splitted.forEach((word) => {
      final += word.charAt(0);
    });
    return final.slice(0, 2);
  };

  const searchChannel = (e) => {
    let results = channels.filter((c) =>
      c.name.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setFiltered(results);
  };

  return (
    <>
      <header className="h-16 flex flex-none items-center shadow-lg w-full mb-2 px-4">
        <div className="flex justify-between items-center cursor-pointer w-full">
          <span className="font-bold mr-4">Channels</span>
          <span
            onClick={() => setShowModal(true)}
            className="font-bold text-xl h-8 w-8 rounded bg-mBg flex justify-center items-center hover:bg-mBlue hover:text-white transition-all duration-300"
          >
            {" "}
            +{" "}
          </span>
        </div>
      </header>

      {/* Search Input */}
      <div className="px-4 mb-6">
        <Input icon={search} onChange={(e) => searchChannel(e)} />
      </div>

      {/* List of channels */}
      <div className="h-full px-4 overflow-y-auto">
        <div className="h-auto">
          {/* <h3 className="font-bold text-xl uppercase my-8">Members</h3> */}
          {filtered.length > 0 && (
            <ul>
              {filtered.map((channel) => {
                return (
                  <li
                    onClick={(e) => changeChannel(channel)}
                    className="group flex items-center mb-8 cursor-pointer"
                    key={channel._id}
                  >
                    <span className="flex items-center justify-center uppercase h-8 min-w-8 rounded bg-mBlue text-white font-bold mr-4 ">
                      {transformName(channel.name)}
                    </span>
                    <span className="uppercase font-bold group-hover:text-white transition-colors duration-300">
                      {channel.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <ChannelModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default SidebarChannels;
