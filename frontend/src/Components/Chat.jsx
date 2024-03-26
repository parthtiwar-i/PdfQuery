import React, { useEffect, useRef, useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ChatBody from "./ChatBody";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatAtom, fileAtom } from "../atoms";
import axios from "axios";

const Chat = () => {
  const [chat, setChat] = useRecoilState(chatAtom);
  const [query, setQuery] = useState("");
  const fileName = useRecoilValue(fileAtom);
  const chatRef = useRef(null);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileName) {
      alert("Please select the document first");
      setQuery("");
      return;
    }
    const userQuery = {
      chat: query,
      img: "user",
    };
    setChat((c) => [...c, userQuery]);

    const data = {
      query: query,
      store: fileName,
    };
    setQuery("");
    try {
      const response = await axios.post(
        "https://pdfquery-c6g1.onrender.com/query/",
        data,
        {
          headers: {
            "content-type": "application/json",
          },
        }
      );
      const aiResponse = {
        chat: response.data.response,
        img: "ai",
      };
      setChat((c) => [...c, aiResponse]);
      // console.log("Response:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [chat]);

  return (
    <>
      <div className="h-[calc(100vh-5rem)] relative ">
        <div
          ref={chatRef}
          className="h-[75vh] px-5 py-2 md:px-44 overflow-auto "
        >
          {chat.map((chat, index) => (
            <ChatBody chat={chat} key={index} />
          ))}
        </div>

        <form action="" onSubmit={handleSubmit}>
          <div className=" w-4/5 p-1 flex items-center justify-between text-center bg-white mx-auto rounded-md border border-gray-300 ">
            <input
              value={query}
              onChange={handleChange}
              type="text"
              placeholder="Send a message..."
              name=""
              id=""
              className="w-[90%] h-10 px-5 py-2 outline-none "
            />
            <button type="submit" className="pr-2">
              <SendOutlinedIcon />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
