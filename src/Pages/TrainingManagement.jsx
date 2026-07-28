import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Play,
  Plus,
  Search,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import {
  FiBell,
  FiLogOut,
  FiMail,
  FiMoon,
  FiSearch,
  FiSettings,
  FiSun,
} from "react-icons/fi";
import PracticeLab from "./PracticeLab";
import { logout } from "../utils/auth";

const catalog = {
  Courses: [
    {
      title: "Full Stack JavaScript",
      meta: "Intermediate · 12 weeks",
      status: "Published",
      people: "42 learners",
    },
    {
      title: "Data Engineering Fundamentals",
      meta: "Beginner · 8 weeks",
      status: "Published",
      people: "28 learners",
    },
    {
      title: "Leadership Essentials",
      meta: "Beginner · 4 weeks",
      status: "Draft",
      people: "16 learners",
    },
  ],
  Batches: [
    {
      title: "FS-2026-JUL",
      meta: "Full Stack JavaScript · Jul 21 – Oct 10",
      status: "Active",
      people: "42 learners",
    },
    {
      title: "DE-2026-AUG",
      meta: "Data Engineering · Aug 04 – Sep 26",
      status: "Upcoming",
      people: "28 learners",
    },
  ],
  Assignments: [
    {
      title: "Build a REST API",
      meta: "Full Stack JavaScript · Due Jul 23",
      status: "Published",
      people: "31 submissions",
    },
    {
      title: "SQL Window Functions",
      meta: "Data Engineering · Due Jul 25",
      status: "Published",
      people: "18 submissions",
    },
  ],
  "Live Classes": [
    {
      title: "React State Management",
      meta: "Today · 3:00 PM – 4:00 PM",
      status: "Live",
      people: "FS-2026-JUL",
    },
    {
      title: "SQL Query Optimisation",
      meta: "Tomorrow · 11:00 AM – 12:00 PM",
      status: "Scheduled",
      people: "DE-2026-AUG",
    },
  ],
  Quizzes: [
    {
      title: "JavaScript Foundations",
      meta: "20 questions · 30 mins",
      status: "Published",
      people: "36 attempts",
    },
    {
      title: "Data Modelling",
      meta: "15 questions · 25 mins",
      status: "Draft",
      people: "—",
    },
  ],
  Resources: [
    {
      title: "React Patterns Handbook",
      meta: "PDF · Full Stack JavaScript",
      status: "Available",
      people: "124 downloads",
    },
    {
      title: "SQL Practice Workbook",
      meta: "ZIP · Data Engineering",
      status: "Available",
      people: "82 downloads",
    },
  ],
  Certificates: [
    {
      title: "Aarav Mehta",
      meta: "Full Stack JavaScript · NP-TMS-2026-0102",
      status: "Issued",
      people: "Jul 18, 2026",
    },
    {
      title: "Meera Nair",
      meta: "Data Engineering · NP-TMS-2026-0101",
      status: "Issued",
      people: "Jul 16, 2026",
    },
  ],
};

const nav = [
  "Dashboard",
  "Courses",
  "Batches",
  "Trainers",
  "Students",
  "Live Classes",
  "Assignments",
  "Practice Lab",
  "Resources",
  "Quizzes",
  "Attendance",
  "Certificates",
  "Reports",
  "Settings",
];
const icon = {
  Dashboard: LayoutDashboard,
  Courses: BookOpen,
  Batches: Users,
  Trainers: GraduationCap,
  Students: Users,
  "Live Classes": Video,
  Assignments: FileText,
  "Practice Lab": Code2,
  Resources: FileText,
  Quizzes: Trophy,
  Attendance: CheckCircle2,
  Certificates: GraduationCap,
  Reports: BarChart3,
  Settings: CheckCircle2,
};

function Stat({ label, value, note, Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-xs font-medium text-emerald-600">{note}</p>
        </div>
        <span className="rounded-xl bg-sky-50 p-3 text-sky-600 dark:bg-sky-950">
          <Icon size={22} />
        </span>
      </div>
    </div>
  );
}
function Dashboard() {
  return (
    <>
    
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Active courses"
          value="12"
          note="+2 this month"
          Icon={BookOpen}
        />
        <Stat
          label="Active learners"
          value="286"
          note="92% attendance"
          Icon={Users}
        />
        <Stat
          label="Classes today"
          value="04"
          note="Next at 3:00 PM"
          Icon={Video}
        />
        <Stat
          label="Completion rate"
          value="84%"
          note="+6.4% vs last month"
          Icon={Trophy}
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Learning activity
            </h2>
            <button className="text-sm text-sky-600">Last 30 days</button>
          </div>
          <div className="mt-8 flex h-44 items-end gap-3">
            {[42, 63, 49, 78, 68, 92, 74, 86, 58, 95, 72, 82].map((n, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-md bg-gradient-to-t from-sky-500 to-cyan-300"
                style={{ height: `${n}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-slate-400">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4</span>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Today’s classes
          </h2>
          {catalog["Live Classes"].map((item, i) => (
            <div className="mt-4 flex items-center gap-3" key={item.title}>
              <div className="rounded-lg bg-violet-100 p-2 text-violet-600 dark:bg-violet-950">
                <Video size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500">{item.meta}</p>
              </div>
              <button className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white">
                {i === 0 ? "Join" : "Details"}
              </button>
            </div>
          ))}
        </section>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Pending reviews
          </h2>
          {[
            "Build a REST API",
            "SQL Window Functions",
            "Portfolio Project",
          ].map((t, i) => (
            <div className="mt-4 flex items-center justify-between" key={t}>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {t}
                </p>
                <p className="text-xs text-slate-500">
                  {[12, 7, 4][i]} submissions need review
                </p>
              </div>
              <ChevronRight className="text-slate-400" size={18} />
            </div>
          ))}
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Top learners
          </h2>
          {["Aarav Mehta", "Meera Nair", "Kabir Shah"].map((name, i) => (
            <div className="mt-4 flex items-center gap-3" key={name}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  {name}
                </p>
                <div className="mt-1 h-1.5 rounded bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded bg-sky-500"
                    style={{ width: `${96 - i * 5}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {96 - i * 5}%
              </span>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
function CodingLab() {
  const [code, setCode] = useState(
    "function twoSum(nums, target) {\n  // Write your solution here\n  return [];\n}",
  );
  return (
    <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-slate-700 bg-[#111827] lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-slate-700 p-4 lg:border-b-0 lg:border-r">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Explorer
        </p>
        <button className="mt-5 flex w-full items-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-sm text-white">
          <Plus size={16} /> New file
        </button>
        <div className="mt-5 space-y-2 text-sm text-slate-300">
          <p>▾ challenge</p>
          <p className="pl-4 text-sky-400">⌘ solution.js</p>
          <p className="pl-4">README.md</p>
        </div>
        <div className="mt-10 rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-slate-300">
          <p className="font-semibold">Two Sum</p>
          <p className="mt-2 text-slate-400">
            Find indices of two values that add up to target.
          </p>
          <p className="mt-3 text-amber-400">Medium · 100 marks</p>
        </div>
      </aside>
      <main className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
          <span className="text-sm text-slate-300">solution.js</span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-200">
              Save
            </button>
            <button className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white">
              <Play size={13} /> Run
            </button>
            <button className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs text-white">
              Submit
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck="false"
          className="min-h-[360px] flex-1 resize-none bg-[#111827] p-5 font-mono text-sm leading-7 text-slate-200 outline-none"
        />
        <div className="border-t border-slate-700 bg-[#0b1120] p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Output
          </p>
          <p className="mt-2 font-mono text-sm text-emerald-400">
            Ready to run. Choose a language and execute your solution.
          </p>
        </div>
      </main>
    </div>
  );
}
function ListPage({ title }) {
  const [q, setQ] = useState("");
  const items = useMemo(
    () =>
      catalog[title] || [
        {
          title: `No ${title.toLowerCase()} yet`,
          meta: "Create your first item to get started",
          status: "Ready",
          people: "—",
        },
      ],
    [title],
  );
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your training {title.toLowerCase()} in one place.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white">
          <Plus size={17} /> Create {title.slice(0, -1)}
        </button>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center dark:border-slate-800">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            Filter
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {items
            .filter((x) => x.title.toLowerCase().includes(q.toLowerCase()))
            .map((item) => (
              <div
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
                key={item.title}
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950">
                  <BookOpen size={19} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
                </div>
                <p className="text-sm text-slate-500">{item.people}</p>
                <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {item.status}
                </span>
                <button className="text-sm font-semibold text-sky-600">
                  Open
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
export default function TrainingManagement() {
  const [page, setPage] = useState("Dashboard");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-700 dark:bg-[#0b1220] dark:text-slate-300">
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-[#243244] dark:bg-[#0b1220]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-64 rounded-lg bg-gray-100 py-2 pl-10 pr-4 text-gray-700 outline-none dark:border dark:border-[#243244] dark:bg-[#0b1220] dark:text-white"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-gray-700 dark:text-white">
            {theme === "dark" ? <FiMoon /> : <FiSun />}
            <button
              onClick={toggleTheme}
              className="flex h-5 w-10 items-center rounded-full bg-gray-300 p-1 transition-all duration-300 dark:bg-[#18a8e6]"
            >
              <div
                className={`h-4 w-4 rounded-full bg-white shadow-md duration-300 ${
                  theme === "dark" ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          <FiSettings
            onClick={() => navigate("/settings")}
            className="cursor-pointer text-gray-600 transition hover:text-[#18a8e6] dark:text-gray-300"
          />
          <FiBell
            onClick={() => navigate("/notifications")}
            className="cursor-pointer text-gray-600 transition hover:text-[#18a8e6] dark:text-gray-300"
          />
          <FiMail className="cursor-pointer text-gray-600 dark:text-gray-300" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg bg-[#18a8e6] px-4 py-1.5 text-white"
          >
            <FiLogOut />
            Logout
          </button>

          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-white">
              Thomas Fleming
            </span>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-[#0b1220]">
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 dark:border-[#243244] dark:bg-[#0b1220] lg:block">
          <div className="mb-7 flex items-center gap-3 px-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Trainer</p>
              <p className="text-xs text-slate-500">Management System</p>
            </div>
          </div>
          <nav className="space-y-1">
            {nav.map((name) => {
              const I = icon[name];
              return (
                <button
                  onClick={() => setPage(name)}
                  key={name}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${page === name ? "bg-sky-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                >
                  <I size={17} />
                  {name}
                </button>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 bg-slate-50 p-5 dark:bg-[#0b1220] md:p-7">
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-2 text-sky-600">
              <GraduationCap />
              <b>Training Management</b>
            </div>
            <select
              value={page}
              onChange={(e) => setPage(e.target.value)}
              className="rounded-lg border bg-white p-2 text-sm dark:bg-slate-900 dark:text-white"
            >
              {nav.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          {page === "Dashboard" ? (
            <Dashboard />
          ) : page === "Practice Lab" ? (
            <PracticeLab />
          ) : (
            <ListPage title={page} />
          )}
        </main>
      </div>
    </div>
  );
}
