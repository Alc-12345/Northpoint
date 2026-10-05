import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiUserPlus,
} from "react-icons/fi";

export default function StatCard() {
  const stats = [
    {
      title: "Total Employees",
      value: "1007",
      change: "+18.01%",
      icon: FiUsers,
      iconBg: "bg-orange-500",
      changeColor: "text-green-400",
    },
    {
      title: "Active",
      value: "1007",
      change: "+18.01%",
      icon: FiUserCheck,
      iconBg: "bg-green-500",
      changeColor: "text-orange-400",
    },
    {
      title: "Inactive",
      value: "1007",
      change: "+18.01%",
      icon: FiUserX,
      iconBg: "bg-red-500",
      changeColor: "text-orange-400",
    },
    {
      title: "New Joiners",
      value: "67",
      change: "+18.01%",
      icon: FiUserPlus,
      iconBg: "bg-blue-500",
      changeColor: "text-gray-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-white dark:bg-[#0b1220] border dark:border-[#243244] rounded-xl p-5 flex items-center justify-between hover:shadow-md transition"
          >
            {/* Left */}
            <div className="flex items-center gap-4">

              {/* Icon */}
              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${item.iconBg}`}>
                <Icon size={18} />
              </div>

              {/* Text */}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>

                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {item.value}
                </h2>
              </div>

            </div>

            {/* Change */}
            <div className="bg-[#0b1220] text-green-400 text-xs px-2 py-1 rounded">
              {item.change}
            </div>

          </div>
        );
      })}
    </div>
  );
}
