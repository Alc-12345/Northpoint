import React, { useState } from "react";

const EmployeeMessages = () => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    { sender: "Manager", text: "Please submit the project report." },
    { sender: "You", text: "Sure, I will submit it today." },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        sender: "You",
        text: message,
      },
    ]);

    setMessage("");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen dark:bg-gray-900">

      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Messages
      </h1>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg flex flex-col h-[70vh]">

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  msg.sender === "You"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 dark:text-white"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}

        </div>

        {/* Message Input */}
        <div className="border-t dark:border-[#243244] p-4 flex gap-3">

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
};

export default EmployeeMessages;
