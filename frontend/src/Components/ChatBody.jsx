import React from "react";
import ai from "../assets/AI.png";
import user from "../assets/user.png";
const ChatBody = ({ chat }) => {
  return (
    <>
      <div className="flex justify-between items-start  py-5">
        <div className=" w-10 md:w-24 pr-3 rounded-full md:pr-10 h-fit">
          <img
          className=" md:w-10 "
            src={chat.img && chat.img === "user" ? user : ai}
            alt="Response Of"
          />
        </div>
        <div className="w-full">
          <p>
            {chat.chat}
          </p>
        </div>
      </div>
    </>
  );
};

export default ChatBody;
