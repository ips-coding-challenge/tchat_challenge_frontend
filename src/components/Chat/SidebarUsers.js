import React, { useContext } from "react";
import ConnectedUsers from "./ConnectedUsers";
import { store, SHOW_CHANNELS_LIST } from "../../store/store";
import { useHistory } from "react-router-dom";

const SidebarUsers = ({ channel }) => {
  const {
    state: { user, currentChannel },
    dispatch,
  } = useContext(store);

  return (
    <>
      <header className="h-16 flex items-center shadow-lg w-full mb-2 px-4">
        <div className="cursor-pointer">
          <span className="font-bold mr-4">{"<"}</span>
          <span
            onClick={() =>
              dispatch({ type: SHOW_CHANNELS_LIST, payload: true })
            }
            className="font-bold"
          >
            All channels
          </span>
        </div>
      </header>
      {/* Connected Users */}
      <div className="px-4 h-full overflow-y-auto">
        {currentChannel && (
          <div className="mt-6">
            <h3 className="uppercase font-bold text-xl mb-3">
              {currentChannel.name}
            </h3>
            <p>{currentChannel.description}</p>
          </div>
        )}
        <ConnectedUsers />
      </div>
    </>
  );
};

export default SidebarUsers;
