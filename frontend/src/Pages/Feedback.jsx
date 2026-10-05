import React, { useState } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiEdit,
  FiSend,
  FiMessageSquare,
} from "react-icons/fi";

export default function Feedback() {
  const [feedback, setFeedback] = useState("");

  const works = [
    {
      id: 1,
      title: "Homepage UI Design",
      developer: "Rahul Sharma",
      status: "Pending",
    },
    {
      id: 2,
      title: "Login Module",
      developer: "Amit Kumar",
      status: "Pending",
    },
    {
      id: 3,
      title: "Payment Gateway",
      developer: "Priya Singh",
      status: "Approved",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] p-6">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Feedback Module
        </h1>

        <p className="text-gray-400 mt-2">
          Review project work and provide feedback.
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="lg:col-span-2 bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <h2 className="text-white text-xl font-semibold mb-5">
            Submitted Work
          </h2>

          <div className="space-y-4">

            {works.map((item) => (

              <div
                key={item.id}
                className="bg-[#0B1220] border border-[#243244] rounded-lg p-4"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="text-white font-semibold">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {item.developer}
                    </p>

                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      item.status === "Approved"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {item.status}
                  </span>

                </div>

                <div className="flex gap-3 mt-5">

                  <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">

                    <FiCheckCircle />
                    Approve

                  </button>

                  <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">

                    <FiXCircle />
                    Reject

                  </button>

                  <button className="flex items-center gap-2 bg-[#18A8E6] hover:bg-cyan-600 text-white px-4 py-2 rounded-lg">

                    <FiEdit />
                    Suggest Revision

                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* RIGHT */}

        <div className="bg-[#111C2D] border border-[#243244] rounded-xl p-5">

          <div className="flex items-center gap-2 mb-5">

            <FiMessageSquare className="text-[#18A8E6]" />

            <h2 className="text-white text-xl font-semibold">
              Submit Feedback
            </h2>

          </div>

          <textarea
            rows={8}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Write your feedback here..."
            className="w-full bg-[#0B1220] border border-[#243244] rounded-lg p-3 text-white outline-none resize-none"
          />

          <button className="mt-5 w-full bg-[#18A8E6] hover:bg-cyan-600 text-white py-3 rounded-lg flex items-center justify-center gap-2">

            <FiSend />

            Submit Feedback

          </button>

          <div className="mt-8">

            <h3 className="text-white font-semibold mb-3">
              Feedback History
            </h3>

            <div className="space-y-3">

              <div className="bg-[#0B1220] p-3 rounded-lg border border-[#243244]">

                <p className="text-white text-sm">
                  Please improve spacing on homepage banner.
                </p>

                <span className="text-xs text-gray-400">
                  10 June 2026
                </span>

              </div>

              <div className="bg-[#0B1220] p-3 rounded-lg border border-[#243244]">

                <p className="text-white text-sm">
                  Login page approved successfully.
                </p>

                <span className="text-xs text-gray-400">
                  08 June 2026
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}