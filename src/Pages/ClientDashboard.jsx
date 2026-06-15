import React, { useState, useEffect } from "react";
import {
  FiBell,
  FiClock,
  FiDownload,
  FiFileText,
  FiFolder,
  FiMessageSquare,
  FiUpload,
  FiSettings,
  FiPlus,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

export default function ClientDashboard() {
const navigate = useNavigate();

  const handleNotificationClick = () => {
    navigate("/client/Notification");
  };

  const handleSettingsClick = () => {
    navigate("/client/Settings");
  };
const handleAddHours = (task) => {
  navigate("/client/hour-bucket", {
    state: {
      taskId: task.id,
      taskName: task.name,
      currentHours: task.hoursRemaining,
    },
  });
};
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    deadlines: [],
    files: [],
    messages: [],
    activities: [],
    notifications: [],
    financials: {
      projectValue: "$0",
      amountPaid: "$0",
      pendingDue: "$0",
    },
    progressPercentage: 0,
  });
  const addHours = (taskId) => {
  const hours = Number(prompt("Add hours"));

  if (!hours || hours <= 0) return;

  setTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? {
            ...task,
            hoursRemaining: task.hoursRemaining + hours,
          }
        : task
    )
  );
};
const [tasks, setTasks] = useState([
  {
    id: 1,
    name: "Website Design",
    hoursRemaining: 40,
  },
  {
    id: 2,
    name: "API Development",
    hoursRemaining: 28,
  },
  {
    id: 3,
    name: "Testing",
    hoursRemaining: 15,
  },
]);

  useEffect(() => {
    // Simulate API call - Replace with real API when available
    const fetchDashboardData = async () => {
      try {
        // This would be your actual API call
        const data = {
          projects: [
            { name: "Website Redesign", stage: "Design Approval", status: "In Review" },
            { name: "Mobile App", stage: "Testing & QA", status: "On Track" },
          ],
          deadlines: [
            { title: "Final UI Review", date: "Tue 18 Jun", tone: "border-red-500" },
            { title: "API Integration", date: "Sat 22 Jun", tone: "border-cyan-500" },
            { title: "Beta Release", date: "Mon 01 Jul", tone: "border-slate-500" },
          ],
          files: [
            "Design_System_v2.pdf",
            "Homepage_Mockups.zip",
            "QA_Report_Sprint_03.xlsx",
          ],
          messages: [
            { text: "Can the homepage copy be updated before review?", time: "10:20 AM", sent: false },
            { text: "Yes, it will be uploaded today.", time: "10:44 AM", sent: true },
          ],
          activities: [
            { icon: "upload", text: "Mike uploaded revised homepage mockups." },
            { icon: "folder", text: "Sprint board moved to Development." },
            { icon: "clock", text: "Invoice due reminder generated." },
          ],
          notifications: [
            "Invoice Overdue",
            "New File Uploaded",
            "Milestone Reached",
          ],
          financials: {
            projectValue: "$12,500",
            amountPaid: "$3,700",
            pendingDue: "$4,800",
          },
          progressPercentage: 65,
        };
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1220] text-white">
    <div className="flex justify-between items-center mb-0">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-300">
          Client Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          Project Portal
        </h1>
      </div>
     <div className="flex items-center gap-3">
    <button
      onClick={handleNotificationClick}
      className="p-2 text-gray-400 hover:text-white hover:bg-[#172235] rounded-lg transition-all"
    >
      <FiBell size={20} />
    </button>

    <button
      onClick={handleSettingsClick}
      className="p-2 text-gray-400 hover:text-white hover:bg-[#172235] rounded-lg transition-all"
    >
      <FiSettings size={20} />
    </button>
  </div>
  </div>
      <div className="grid grid-cols-12 gap-5">
        <Panel className="col-span-12 lg:col-span-8" title="Project Progress">
          <div className="grid md:grid-cols-[180px_1fr] gap-5">
            <div className="flex justify-center items-center">
              <div className="h-32 w-32 rounded-full border-[10px] border-[#18a8e6] border-r-[#243244] grid place-items-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{dashboardData.progressPercentage}%</p>
                  <p className="text-xs text-gray-300">Complete</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Current Stage : Development</p>
              <p className="text-xs text-gray-300 mt-1">
                Frontend & Backend Integration in Progress.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {dashboardData.projects.map((p) => (
                  <div
                    key={p.name}
                    className="rounded-lg bg-[#0B1220] border border-slate-700 p-3"
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-300">{p.stage}</p>
                    <span className="mt-3 inline-flex rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
        
       
        <Panel className="col-span-12 lg:col-span-4" title="Financials">
          <MoneyRow label="Project Value" value={dashboardData.financials.projectValue} />
          <MoneyRow label="Amount Paid" value={dashboardData.financials.amountPaid} />
          <MoneyRow label="Pending Due" value={dashboardData.financials.pendingDue} />
        </Panel>
        <Panel className="col-span-12 md:col-span-6" title="Upcoming Deadlines">
          <div className="space-y-3">
            {dashboardData.deadlines.map((d) => (
              <div
                key={d.title}
                className={`rounded-lg border-l-4 ${d.tone} bg-[#0B1220] border border-slate-700 p-3`}
              >
                <p className="font-semibold">{d.title}</p>
                <p className="text-xs text-gray-300">{d.date}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel
  className="col-span-12 md:col-span-6"
  title="Hour Buckets"
>
  <div className="grid grid-cols-2 gap-3">
    {tasks.map((task) => (
      <div
        key={task.id}
        className="relative rounded-xl border border-slate-700 bg-[#111827] p-4"
      >
        <button
  onClick={() => handleAddHours(task)}
  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-cyan-500 flex items-center justify-center"
>
  <FiPlus />
</button>

        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">{task.name}</h3>
          <span className="text-cyan-400 font-bold">
            {task.hoursRemaining}h
          </span>
        </div>

        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
            style={{
              width: `${Math.min(task.hoursRemaining, 100)}%`,
            }}
          />
        </div>
      </div>
    ))}
  </div>
</Panel>
        <Panel
          className="col-span-12 md:col-span-6"
          title="Recent Deliverables"
        >
          <div className="space-y-3">
            {dashboardData.files.map((f) => (
              <div
                key={f}
                className="flex justify-between items-center bg-[#0B1220] border border-slate-700 p-3 rounded-lg"
              >
                <span className="flex gap-2 items-center">
                  <FiFileText />
                  {f}
                </span>
                <FiDownload className="text-white" />
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="col-span-12 lg:col-span-6" title="Communication">
          {dashboardData.messages.map((msg, idx) => (
            <Message
              key={idx}
              text={msg.text}
              time={msg.time}
              sent={msg.sent}
            />
          ))}
          <div className="flex items-center gap-2 rounded-lg bg-[#0B1220] border border-slate-700 p-3 mt-3">
            <input
              placeholder="Type Message..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
            />
            <FiMessageSquare className="text-white" />
          </div>
        </Panel>
        <Panel className="col-span-12 lg:col-span-6" title="Recent Activity">
          {dashboardData.activities.map((activity, idx) => {
            let icon;
            switch (activity.icon) {
              case "upload":
                icon = <FiUpload />;
                break;
              case "folder":
                icon = <FiFolder />;
                break;
              case "clock":
                icon = <FiClock />;
                break;
              default:
                icon = <FiBell />;
            }
            return (
              <Activity key={idx} icon={icon} text={activity.text} />
            );
          })}
        </Panel>
        <Panel className="col-span-12" title="Notifications">
          {dashboardData.notifications.map((n) => (
            <div
              key={n}
              className="flex gap-3 p-3 bg-[#0B1220] border border-slate-700 rounded-lg mb-3"
            >
              <FiBell />
              <div>
                <p className="font-semibold">{n}</p>
                <p className="text-xs text-gray-300">
                  Please check latest update.
                </p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, className, children }) {
  return (
    <section
      className={`rounded-xl bg-[#0B1220] border border-slate-700 p-5 ${className}`}
    >
      <h2 className="mb-4 font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

function MoneyRow({ label, value }) {
  return (
    <div className="mb-3 bg-[#0B1220] border border-slate-700 rounded-lg p-4">
      <p className="text-xs text-gray-300">{label}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}

function Message({ text, time, sent }) {
  return (
    <div
      className={`rounded-lg p-3 mb-3 ${sent ? "bg-[#123152]" : "bg-[#0B1220] border border-slate-700"}`}
    >
      <p>{text}</p>
      <p className="text-xs text-gray-300 mt-1">{time}</p>
    </div>
  );
}

function Activity({ icon, text }) {
  return (
    <div className="flex gap-3 p-3 bg-[#0B1220] border border-slate-700 rounded-lg mb-3">
      {icon}
      <span>{text}</span>
    </div>
  );
}
