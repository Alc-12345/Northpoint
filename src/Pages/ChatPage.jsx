import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const currentUserId = "admin123";

  // Common UI Classes (same as AddEmployee)
  const inputClass =
    "w-full border border-gray-200 dark:border-[#243244] " +
    "bg-white dark:bg-[#0b1220] text-gray-800 dark:text-white " +
    "px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  const sectionTitle =
    "text-lg font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-[#243244] pb-2 mb-4";

  useEffect(() => {
    setUsers([
      { _id: "1", name: "Client A" },
      { _id: "2", name: "Client B" },
    ]);

    socket.emit("join", currentUserId);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;

    const msgData = {
      senderId: currentUserId,
      receiverId: selectedUser._id,
      message: input,
      createdAt: new Date(),
    };

    socket.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#0b1220] p-6">
      <div className="max-w-7xl mx-auto bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#243244] rounded-xl shadow-sm overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-[#243244]">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Chat System
          </h1>
        </div>

        <div className="flex h-[75vh]">

          {/* ================= LEFT: CLIENT LIST ================= */}
          <div className="w-1/3 border-r border-gray-200 dark:border-[#243244] p-4">
            <h2 className={sectionTitle}>Clients</h2>

            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user);
                    setMessages([]);
                  }}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    selectedUser?._id === user._id
                      ? "bg-blue-100 dark:bg-blue-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <p className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT: CHAT ================= */}
          <div className="flex flex-col w-2/3">

            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#243244] font-semibold text-gray-800 dark:text-white">
              {selectedUser ? selectedUser.name : "Select a client"}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderId === currentUserId
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                      msg.senderId === currentUserId
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-[#243244] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className={inputClass}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}   
