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

const Content = () => {
  const {
    state: { currentChannel },
  } = useContext(store);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesContainerRef = useRef(null);

  const sendMessage = async () => {
    try {
      await client.service("messages").create({
        content: message,
        channelId: currentChannel._id,
      });
      setMessage("");
    } catch (e) {
      console.log(`E`, e);
    }
  };

  // Fetch the messages
  const fetchMessages = useCallback(async () => {
    try {
      const messages = await client
        .service("channels")
        .get(currentChannel._id.toString());
      setMessages(messages.messages.data);
      if (messages.messages.data.length > 0) {
        setTimeout(() => {
          scrollToBottom();
        }, 50);
      }
    } catch (e) {
      console.log(`E`, e);
    } finally {
      setLoading(false);
    }

    // console.log(`Messages`, messages);
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
        console.log(`Message received`, message);
        setMessages((messages) => messages.concat(message));
        scrollToBottom();
      }
    });

    return () => {
      client.service("messages").removeListener("created");
    };
  }, [currentChannel]);

  // Scroll To bottom
  const scrollToBottom = () => {
    messagesContainerRef.current.scrollIntoView();
  };

  const showNavbar = () => {
    document.querySelector(".sidebar").classList.add("open");
  };

  if (loading) return <div className="lds-dual-ring"></div>;

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
        {messages.length > 0 && (
          <>
            <ul className="h-auto">
              {messages.map((m) => (
                <Message key={m._id} message={m} />
              ))}
            </ul>
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
          <button className="flex items-center justify-center bg-mBlue px-2 py-2 rounded">
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
