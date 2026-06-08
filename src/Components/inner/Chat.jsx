import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiSettings } from "react-icons/fi";

export default function Chat() {

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Good morning",
      time: "12:45 PM",
      sender: "other",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      id: 2,
      text: "Can you arrange schedule for next meeting?",
      sender: "other",
      avatar: "https://i.pravatar.cc/40?img=12",
    },
    {
      id: 3,
      text: "Very Good morning",
      sender: "me",
      time: "9:25 AM",
    },
    {
      id: 4,
      text:
        "Okay, I'll arrange it soon. i notify you when it's done\n+91-235 2574 2566\nkk Sharma\npan card eeer2063i",
      sender: "me",
      time: "9:30 AM",
    },
  ]);

  const [input, setInput] = useState("");

  const messagesEndRef = useRef();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const sendMessage = () => {

    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: input,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
  };

  return (
    <div
      className="
      h-full
      w-full
      flex flex-col
      bg-white dark:bg-[#0b1220]
      border border-gray-200 dark:border-[#243244]
      rounded-xl
      p-5
    "
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-4">

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chat
        </h2>

        <button className="flex items-center gap-2 text-blue-500 text-sm">
          <FiSettings size={16} />
          Setting
        </button>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            {/* Other message */}
            {msg.sender === "other" && (

              <div className="flex gap-3 max-w-[80%]">

                <img
                  src={msg.avatar}
                  className="w-8 h-8 rounded-full"
                />

                <div>

                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    {msg.text}
                  </div>

                  {msg.time && (
                    <div className="text-xs text-gray-400 mt-1">
                      {msg.time}
                    </div>
                  )}

                </div>

              </div>

            )}

            {/* My message */}
            {msg.sender === "me" && (

              <div className="max-w-[80%]">

                <div className="bg-gray-600 text-white px-4 py-2 rounded-lg whitespace-pre-line">
                  {msg.text}
                </div>

                {msg.time && (
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {msg.time}
                  </div>
                )}

              </div>

            )}

          </div>

        ))}

        <div ref={messagesEndRef}></div>

      </div>

      {/* Input (always bottom) */}
      <div className="mt-4 flex gap-2">

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="
          flex-1
          bg-gray-100 dark:bg-gray-800
          border border-gray-300 dark:border-[#243244]
          rounded-lg
          px-4 py-2
          text-gray-900 dark:text-white
          outline-none
        "
        />

        <button
          onClick={sendMessage}
          className="
          bg-blue-500
          hover:bg-blue-600
          text-white
          px-4
          rounded-lg
          flex items-center justify-center
        "
        >
          <FiSend />
        </button>

      </div>

    </div>
  );
}
