import React from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiShoppingCart,
} from "react-icons/fi";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const Charts = () => {
  const stats = [
    {
      title: "Total Sales",
      value: "$45,230",
      icon: <FiTrendingUp size={22} />,
      color: "bg-blue-500",
    },
    {
      title: "Revenue",
      value: "$78,540",
      icon: <FiDollarSign size={22} />,
      color: "bg-green-500",
    },
    {
      title: "Customers",
      value: "1,240",
      icon: <FiUsers size={22} />,
      color: "bg-purple-500",
    },
    {
      title: "Orders",
      value: "320",
      icon: <FiShoppingCart size={22} />,
      color: "bg-orange-500",
    },
  ];

  // Dummy Data
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 5000 },
    { name: "Apr", sales: 4000 },
    { name: "May", sales: 6000 },
    { name: "Jun", sales: 7000 },
  ];

  const revenueData = [
    { name: "Mon", revenue: 2000 },
    { name: "Tue", revenue: 3000 },
    { name: "Wed", revenue: 2500 },
    { name: "Thu", revenue: 4000 },
    { name: "Fri", revenue: 3500 },
    { name: "Sat", revenue: 4200 },
  ];

  const customerData = [
    { name: "Jan", customers: 200 },
    { name: "Feb", customers: 350 },
    { name: "Mar", customers: 500 },
    { name: "Apr", customers: 650 },
    { name: "May", customers: 800 },
  ];

  const orderData = [
    { name: "Online", value: 400 },
    { name: "Store", value: 300 },
    { name: "App", value: 200 },
    { name: "Other", value: 100 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Charts & Analytics
        </h1>
        <p className="text-gray-500 text-sm">
          Visualize your business performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#2A2A2A] p-6 rounded-xl shadow flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {stat.value}
              </h2>
            </div>

            <div
              className={`w-10 h-10 flex items-center justify-center text-white rounded-lg ${stat.color}`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}

        <div className="bg-white dark:bg-[#2A2A2A] p-8 rounded-xl shadow">
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
            Sales Overview
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}

        <div className="bg-white dark:bg-[#2A2A2A] p-8 rounded-xl shadow">
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
            Revenue Analytics
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth */}

        <div className="bg-white dark:bg-[#2A2A2A] p-8 rounded-xl shadow">
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
            Customer Growth
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={customerData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="customers" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}

        <div className="bg-white dark:bg-[#2A2A2A] p-8 rounded-xl shadow">
          <h2 className="font-semibold mb-4 text-gray-800 dark:text-white">
            Orders Statistics
          </h2>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={orderData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {orderData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
