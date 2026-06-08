import {
  FiBell,
  FiCheck,
  FiClock,
  FiDownload,
  FiFileText,
  FiFolder,
  FiMessageSquare,
  FiPlus,
  FiUpload,
} from "react-icons/fi";

const projects = [
  { name: "Website Redesign", stage: "Design Approval", status: "In Review" },
  { name: "Mobile App", stage: "Testing & QA", status: "On Track" },
];

const deadlines = [
  { title: "Final UI Review", date: "Tue 18 Jun", tone: "border-red-500" },
  { title: "API Integration", date: "Sat 22 Jun", tone: "border-cyan-500" },
  { title: "Beta Release", date: "Mon 01 Jul", tone: "border-slate-500" },
];

const files = [
  "Design_System_v2.pdf",
  "Homepage_Mockups.zip",
  "QA_Report_Sprint_03.xlsx",
];

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-6 dark:bg-[#07111f]">

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Client Dashboard
          </p>

          <h1 className="mt-1 text-2xl font-semibold dark:text-white">
            Project Portal
          </h1>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-[#18a8e6] px-4 py-2 text-sm font-semibold text-white">
          <FiPlus />
          New Request
        </button>
      </div>

      <div className="grid grid-cols-12 gap-5">

        <Panel className="col-span-12 lg:col-span-8" title="Project Progress">

          <div className="grid md:grid-cols-[180px_1fr] gap-5">

            <div className="flex justify-center items-center">

              <div className="h-32 w-32 rounded-full border-[10px] border-[#18a8e6] border-r-[#243244] grid place-items-center">

                <div className="text-center">
                  <p className="text-2xl font-bold dark:text-white">
                    65%
                  </p>

                  <p className="text-xs text-gray-400">
                    Complete
                  </p>
                </div>

              </div>

            </div>

            <div>

              <p className="font-semibold dark:text-white">
                Current Stage : Development
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Frontend & Backend Integration in Progress.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mt-4">

                {projects.map((project) => (

                  <div
                    key={project.name}
                    className="rounded-lg bg-slate-50 dark:bg-[#0f1828] p-3"
                  >
                    <p className="font-semibold dark:text-white">
                      {project.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {project.stage}
                    </p>

                    <span className="mt-3 inline-flex rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
                      {project.status}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </Panel>
        <Panel
  className="col-span-12 lg:col-span-4"
  title="Hour Bucket"
>
  <div className="flex justify-center mb-5">

    <div className="relative w-36 h-36">

      <svg className="w-36 h-36 rotate-[-90deg]">

        <circle
          cx="72"
          cy="72"
          r="58"
          stroke="#243244"
          strokeWidth="12"
          fill="none"
        />

        <circle
          cx="72"
          cy="72"
          r="58"
          stroke="#18A8E6"
          strokeWidth="12"
          fill="none"
          strokeDasharray="364"
          strokeDashoffset="91"
          strokeLinecap="round"
        />

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <h2 className="text-3xl font-bold text-white">
          75%
        </h2>

        <p className="text-xs text-slate-400">
          Used
        </p>

      </div>

    </div>

  </div>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span className="text-slate-400">
        Purchased Hours
      </span>

      <span className="text-white">
        120 Hrs
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
        Used Hours
      </span>

      <span className="text-[#18A8E6]">
        90 Hrs
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-slate-400">
        Remaining
      </span>

      <span className="text-green-400">
        30 Hrs
      </span>
    </div>

  </div>

</Panel>

        <Panel className="col-span-12 lg:col-span-4" title="Financials">
          <MoneyRow label="Project Value" value="$12,500" />
          <MoneyRow label="Amount Paid" value="$3,700" />
          <MoneyRow label="Pending Due" value="$4,800" />
        </Panel>
        

        <Panel
          className="col-span-12 md:col-span-6 lg:col-span-4"
          title="Upcoming Deadlines"
        >
          <div className="space-y-3">

            {deadlines.map((item) => (

              <div
                key={item.title}
                className={`rounded-lg border-l-4 ${item.tone} bg-slate-50 dark:bg-[#0f1828] p-3`}
              >
                <p className="font-semibold dark:text-white">
                  {item.title}
                </p>

                <p className="text-xs text-gray-400">
                  {item.date}
                </p>

              </div>

            ))}

          </div>
        </Panel>

        <Panel
          className="col-span-12 md:col-span-6 lg:col-span-4"
          title="Recent Deliverables"
        >
          <div className="space-y-3">

            {files.map((file) => (

              <div
                key={file}
                className="flex justify-between items-center bg-slate-50 dark:bg-[#0f1828] p-3 rounded-lg"
              >
                <span className="flex gap-2 items-center dark:text-white">
                  <FiFileText />
                  {file}
                </span>

                <FiDownload />

              </div>

            ))}

          </div>
        </Panel>

        <Panel className="col-span-12 lg:col-span-4" title="Communication">

          <Message
            text="Can the homepage copy be updated before review?"
            time="10:20 AM"
          />

          <Message
            text="Yes, it will be uploaded today."
            time="10:44 AM"
            sent
          />

          <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-[#0f1828] p-3 mt-3">

            <input
              placeholder="Type Message..."
              className="flex-1 bg-transparent outline-none dark:text-white"
            />

            <FiMessageSquare />

          </div>

        </Panel>

        <Panel className="col-span-12 lg:col-span-6" title="Recent Activity">

          <Activity
            icon={<FiUpload />}
            text="Mike uploaded revised homepage mockups."
          />

          <Activity
            icon={<FiFolder />}
            text="Sprint board moved to Development."
          />

          <Activity
            icon={<FiClock />}
            text="Invoice due reminder generated."
          />

        </Panel>

        <Panel className="col-span-12 lg:col-span-6" title="Notifications">

          {[
            "Invoice Overdue",
            "New File Uploaded",
            "Milestone Reached",
          ].map((item) => (

            <div
              key={item}
              className="flex gap-3 p-3 bg-slate-50 dark:bg-[#0f1828] rounded-lg mb-3"
            >
              <FiBell />

              <div>
                <p className="font-semibold dark:text-white">
                  {item}
                </p>

                <p className="text-xs text-gray-400">
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
      className={`rounded-xl bg-white dark:bg-[#0b1220] p-5 ${className}`}
    >
      <h2 className="mb-4 font-semibold dark:text-white">
        {title}
      </h2>

      {children}
    </section>
  );
}

function MoneyRow({ label, value }) {
  return (
    <div className="mb-3 bg-slate-50 dark:bg-[#0f1828] rounded-lg p-4">
      <p className="text-xs text-gray-400">{label}</p>

      <h2 className="text-xl font-bold dark:text-white">
        {value}
      </h2>
    </div>
  );
}

function Message({ text, time, sent }) {
  return (
    <div
      className={`rounded-lg p-3 mb-3 ${
        sent
          ? "bg-blue-100 dark:bg-[#123152]"
          : "bg-slate-100 dark:bg-[#172235]"
      }`}
    >
      <p className="dark:text-white">{text}</p>

      <p className="text-xs text-gray-400 mt-1">
        {time}
      </p>
    </div>
  );
}

function Activity({ icon, text }) {
  return (
    <div className="flex gap-3 p-3 bg-slate-50 dark:bg-[#0f1828] rounded-lg mb-3">
      {icon}

      <span className="dark:text-white">
        {text}
      </span>
    </div>
  );
}