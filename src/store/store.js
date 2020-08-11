import React, { createContext, useReducer } from "react";

export const SET_USER = "SET_USER";
export const SET_CONNECTED_USERS = "SET_CONNECTED_USERS";
export const ADD_USER = "ADD_USER";
export const UPDATE_CHANNEL_FOR_USER = "UPDATE_CHANNEL_FOR_USER";
export const REMOVE_USER = "REMOVE_USER";
export const SET_CHANNELS = "SET_CHANNELS";
export const ADD_CHANNEL = "ADD_CHANNEL";
export const SHOW_CHANNELS_LIST = "SHOW_CHANNELS_LIST";
export const SET_CURRENT_CHANNEL = "SET_CURRENT_CHANNEL";

const initial = {
  user: null,
  connectedUsers: [],
  channels: [],
  currentChannel: null,
  showChannelsList: false,
};

const store = createContext(initial);

const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_USER:
        return { ...state, user: action.payload };
      case SET_CHANNELS:
        return { ...state, channels: action.payload };
      case ADD_CHANNEL: {
        return { ...state, channels: state.channel.concat(action.payload) };
      }
      case SET_CURRENT_CHANNEL: {
        return { ...state, currentChannel: action.payload };
      }
      case SET_CONNECTED_USERS:
        return { ...state, connectedUsers: action.payload };
      case ADD_USER: {
        return {
          ...state,
          connectedUsers: state.connectedUsers.concat(action.payload),
        };
      }
      case UPDATE_CHANNEL_FOR_USER: {
        state.connectedUsers[action.payload.index] = action.payload.item;
        return state;
      }
      case REMOVE_USER: {
        const userEntries = state.connectedUsers.findIndex(
          (c) => c.userId === action.payload.userId
        );
        // let updatedConnectedUsers = []
        if (userEntries && userEntries.length > 0) {
          userEntries.forEach((index) => {
            // const index = state.connectedUsers.findIndex(c => c.userId)
            state.connectedUsers.splice(index, 1);
          });
        }
        return { ...state };
      }
      case SHOW_CHANNELS_LIST: {
        return { ...state, showChannelsList: !state.showChannelsList };
      }
      default:
        return state;
    }
  }, initial);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
