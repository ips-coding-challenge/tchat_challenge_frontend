import React, { useEffect, useState, useCallback, useContext } from "react";
import Layout from "../components/Layout";
import { useHistory } from "react-router-dom";
import client from "../client";
import {
  store,
  ADD_USER,
  SET_CHANNELS,
  SET_CURRENT_CHANNEL,
} from "../store/store";
import Content from "../components/Chat/Content";
import Sidebar from "../components/Chat/Sidebar";

const Chat = () => {
  const { dispatch } = useContext(store);
  const clientChannels = client.service("channels");

  const fetchChannels = useCallback(async () => {
    try {
      const response = await clientChannels.find();
      // Get all channels
      // setChannels(response.data);
      dispatch({ type: SET_CHANNELS, payload: response.data });
      dispatch({ type: SET_CURRENT_CHANNEL, payload: response.data[0] });
      // Set the current Channel to the first record ( to have some message to display by default)

      // Save the user in the connected db
      try {
        await client
          .service("connected-users")
          .create({ channelId: response.data[0]._id });
      } catch (e) {
        console.log(`E`, e.message);
      }
    } catch (e) {
      console.log(`Error`, e);
    }
  }, []);

  useEffect(() => {
    fetchChannels();
    client.service("channels").on("created", (channel) => {
      console.log(`Channels created`);
      fetchChannels();
    });
    return () => {
      client.service("channels").removeListener("created");
    };
  }, []);

  return (
    <Layout>
      <div className="h-screen w-full flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <Content />
      </div>
    </Layout>
  );
};

export default Chat;
