import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import Message from "./Message";
import client from "../../client";
import { store } from "../../store/store";
import { format } from "date-fns";
import { useReducer } from "react";

const Content = () => {
  const {
    state: { currentChannel },
  } = useContext(store);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_MESSAGES":
          return { ...state, messages: action.payload };
        case "ADD_MESSAGE": {
          const formattedDate = format(
            new Date(action.payload.createdAt),
            "Y-MM-d"
          );

          // Check if there are messages for that date
          const index = state.messages.findIndex(
            (m) => m._id.date === formattedDate
          );

          // If there are no messages for that date i just create a new "dategroup" with the message
          if (index === -1) {
            const newBlock = {
              _id: {
                date: formattedDate,
              },
              messages: [action.payload],
            };
            const newMessages = state.messages.concat(newBlock);
            return { ...state, messages: newMessages };
          } else {
            state.messages[index] = {
              _id: state.messages[index]._id,
              messages: state.messages[index].messages.concat(action.payload),
            };
            return { ...state };
          }
        }
        default:
          return state;
      }
    },
    { messages: [] }
  );
  // const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  const sendMessage = async () => {
    setSending(true);
    try {
      await client.service("messages").create({
        content: message,
        channelId: currentChannel._id,
      });
      setMessage("");
    } catch (e) {
      console.log(`E`, e);
    } finally {
      setSending(false);
    }
  };

  // Fetch the messages
  const fetchMessages = useCallback(async () => {
    try {
      const messages = await client.service("messages").find({
        query: {
          channelId: currentChannel._id.toString(),
          $sort: {
            createdAt: -1,
          },
        },
      });
      console.log(`Messages`, messages);
      // Date in messages[index]._id
      // messages in messages[index].messages
      // setMessages(() => messages);
      dispatch({ type: "SET_MESSAGES", payload: messages });
      setTimeout(() => {
        scrollToBottom();
      }, 200);
    } catch (e) {
      console.log(`E`, e);
    } finally {
      setLoading(false);
    }
  }, [currentChannel]);

  // Fetch the messages when the component is mounted
  // Listen to new messages
  useEffect(() => {
    if (currentChannel) {
      fetchMessages();
    }
    // Add the listener
    client.service("messages").on("created", (message) => {
      if (message.channelId === currentChannel._id) {
        dispatch({ type: "ADD_MESSAGE", payload: message });
        scrollToBottom();
      }
    });

    return () => {
      client.service("messages").removeListener("created");
    };
  }, [currentChannel]);

  // Scroll To bottom
  const scrollToBottom = () => {
    if (messagesContainerRef && messagesContainerRef.current) {
      messagesContainerRef.current.scrollIntoView();
    }
  };

  const showNavbar = () => {
    document.querySelector(".sidebar").classList.add("open");
  };

  const formattedDate = (date) => {
    return format(new Date(date), "MMMM d, Y");
  };

  if (loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="lds-dual-ring"></div>
      </div>
    );

  return (
    <div className="flex flex-col bg-chatBg w-full overflow-hidden">
      {/* Header */}
      <header className="h-16 flex flex-none items-center shadow-lg w-full mb-2">
        <div className="container mx-auto flex items-center px-4 lg:px-10">
          <div onClick={showNavbar} className="lg:hidden mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="24px"
              height="24px"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </div>
          <h2 className="font-bold uppercase">{currentChannel.name}</h2>
        </div>
      </header>
      <div className="container mx-auto px-4 lg:px-10 h-auto flex-auto overflow-y-auto">
        {/* <div className="h-full"> */}
        {state.messages.length > 0 && (
          <>
            {state.messages.map((block) => {
              return (
                <ul key={block._id.date} className="h-auto">
                  <h3
                    style={{
                      lineHeight: "0.1em",
                      margin: "10px 0 20px",
                      borderColor: "#ffffff1f",
                    }}
                    className="w-full border-b text-center border-opacity-25"
                  >
                    <span
                      style={{ padding: "0 10px" }}
                      className="bg-chatBg
                    "
                    >
                      {formattedDate(block._id.date)}
                    </span>
                  </h3>
                  {block.messages.map((m) => (
                    <Message key={m._id} message={m} />
                  ))}
                </ul>
              );
            })}

            <div ref={messagesContainerRef}></div>
          </>
        )}
        {/* </div> */}
      </div>
      <div className="container mx-auto px-4 lg:px-10 mb-6 mt-4">
        <div className="flex items-center bg-mGray3 rounded h-12 p-2">
          <input
            style={{ minWidth: 0 }}
            className="bg-transparent text-mBlue text-sm font-bold h-full w-full px-2 mr-4"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message here..."
            onKeyPress={(e) =>
              e.key === "Enter" ? sendMessage(message) : null
            }
          />
          <button
            onClick={sendMessage}
            className="flex items-center justify-center bg-mBlue px-2 py-2 rounded"
            disabled={sending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="18px"
              height="18px"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Content;
