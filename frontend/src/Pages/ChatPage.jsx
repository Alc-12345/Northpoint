import React, { useState } from "react";
import {
  FiSend,
  FiPaperclip,
  FiSearch,
  FiUsers,
  FiFileText,
} from "react-icons/fi";

export default function Communication() {
  const [message, setMessage] = useState("");

  const chats = [
    {
      name: "Rahul Sharma",
      msg: "Homepage design completed.",
      time: "10:15 AM",
      mine: false,
    },
    {
      name: "You",
      msg: "Please upload Figma file.",
      time: "10:18 AM",
      mine: true,
    },
    {
      name: "Priya",
      msg: "Uploading now.",
      time: "10:22 AM",
      mine: false,
    },
  ];

  const files = [
    "Homepage_UI.fig",
    "Logo_Final.png",
    "Requirement.pdf",
    "Client_Feedback.docx",
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Communication
          </h1>

          <p className="text-gray-400 mt-1">
            Team Communication & File Discussion
          </p>
        </div>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <div className="flex items-center gap-2 mb-4">
            <FiUsers className="text-[#18A8E6]" />
            <h2 className="text-white font-semibold">
              Team Members
            </h2>
          </div>

          <div className="space-y-4">

            {["Rahul","Priya","Amit","Neha"].map((item,index)=>(
              <div
              key={index}
              className="flex items-center justify-between bg-[#0B1220] p-3 rounded-lg"
              >

                <div className="flex items-center gap-3">

                  <img
                  src={`https://i.pravatar.cc/40?img=${index+10}`}
                  className="w-10 h-10 rounded-full"
                  />

                  <div>

                    <p className="text-white">
                      {item}
                    </p>

                    <p className="text-xs text-gray-400">
                      Online
                    </p>

                  </div>

                </div>

                <span className="w-2 h-2 rounded-full bg-green-400"></span>

              </div>
            ))}

          </div>

        </div>

        {/* CHAT */}

        <div className="lg:col-span-2 bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-white font-semibold">
              Team Chat
            </h2>

            <div className="relative">

              <FiSearch className="absolute left-3 top-3 text-gray-400"/>

              <input
              placeholder="Search..."
              className="bg-[#0B1220] border border-[#243244] rounded-lg pl-10 pr-3 py-2 text-white outline-none"
              />

            </div>

          </div>

          <div className="space-y-4 h-[350px] overflow-y-auto">

            {chats.map((chat,index)=>(

              <div
              key={index}
              className={`max-w-md p-3 rounded-lg ${
                chat.mine
                ? "bg-[#18A8E6] ml-auto text-white"
                : "bg-[#0B1220] text-white"
              }`}
              >

                {!chat.mine && (
                  <p className="text-xs text-[#18A8E6] mb-1">
                    {chat.name}
                  </p>
                )}

                <p>
                  {chat.msg}
                </p>

                <p className="text-xs opacity-60 mt-2">
                  {chat.time}
                </p>

              </div>

            ))}

          </div>

          <div className="mt-5 flex gap-3">

            <button className="w-12 h-12 rounded-lg bg-[#0B1220] border border-[#243244] flex justify-center items-center text-white">
              <FiPaperclip />
            </button>

            <input
            value={message}
            onChange={(e)=>setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#0B1220] border border-[#243244] rounded-lg px-4 text-white outline-none"
            />

            <button className="w-12 h-12 rounded-lg bg-[#18A8E6] text-white flex justify-center items-center">
              <FiSend/>
            </button>

          </div>

        </div>

      </div>

      {/* FILE DISCUSSION */}

      <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5 mt-6">

        <div className="flex items-center gap-2 mb-5">

          <FiFileText className="text-[#18A8E6]" />

          <h2 className="text-white font-semibold">
            File Discussions
          </h2>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {files.map((file,index)=>(

            <div
            key={index}
            className="bg-[#0B1220] border border-[#243244] rounded-lg p-4 flex justify-between items-center"
            >

              <div>

                <p className="text-white">
                  {file}
                </p>

                <p className="text-xs text-gray-400">
                  Last updated 2 hrs ago
                </p>

              </div>

              <button className="text-[#18A8E6]">
                View
              </button>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}