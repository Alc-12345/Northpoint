import React, { useState } from "react";

const page1 = [
  {
    name: "Air Conditioner",
    date: "24 Apr 2021",
    price: "$85.20",
    orders: 750,
    stock: "In Stock",
    amount: "$1200.75",
    img: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
  },
  {
    name: "Bag Pack",
    date: "24 Apr 2021",
    price: "$86.20",
    orders: 750,
    stock: "Out of Stock",
    amount: "$1200.75",
    img: "https://cdn-icons-png.flaticon.com/512/2553/2553691.png",
  },
  {
    name: "Black Dress",
    date: "24 Apr 2021",
    price: "$85.20",
    orders: 750,
    stock: "In Stock",
    amount: "$1200.75",
    img: "https://cdn-icons-png.flaticon.com/512/892/892458.png",
  },
  {
    name: "Blade Table Fan",
    date: "24 Apr 2021",
    price: "$85.20",
    orders: 750,
    stock: "In Stock",
    amount: "$1200.75",
    img: "https://cdn-icons-png.flaticon.com/512/1684/1684375.png",
  },
  {
    name: "Boy Dress",
    date: "24 Apr 2021",
    price: "$85.20",
    orders: 750,
    stock: "In Stock",
    amount: "$1200.75",
    img: "https://cdn-icons-png.flaticon.com/512/892/892461.png",
  },
  {
    name: "Earphone",
    date: "24 Apr 2021",
    price: "$85.20",
    orders: 750,
    stock: "In Stock",
    amount: "$1200.75",
    img: "https://cdn-icons-png.flaticon.com/512/727/727245.png",
  },
  {
    name: "Laptop",
    date: "24 Apr 2021",
    price: "$85.20",
    orders: 750,
    stock: "Out of Stock",
    amount: "$1200.75",
    img: "https://cdn-icons-png.flaticon.com/512/2920/2920244.png",
  },
];

const page2 = [
  {
    name: "Mobile Phone",
    date: "24 Apr 2021",
    price: "$95.20",
    orders: 650,
    stock: "In Stock",
    amount: "$1400.75",
    img: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
  },
];

const stockStyle = {
  "In Stock":
    "bg-green-500/20 text-green-400",

  "Out of Stock":
    "bg-red-500/20 text-red-400",
};

export default function BestSellingProducts() {

  const [page, setPage] = useState(1);

  const data = page === 1 ? page1 : page2;

  return (
    <div
      className="
      bg-white dark:bg-[#0b1220]
      border border-gray-200 dark:border-[#243244]
      rounded-xl
      p-6 h-full
      w-full
    "
    >

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Best Selling Products
        </h2>

        <div className="text-sm text-gray-400">
          SORT BY:
          <span className="text-blue-500 ml-2 cursor-pointer">
            Today ▾
          </span>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="border-b border-gray-700 text-gray-400 text-sm">

            <tr>

              <th className="text-left py-3">
                Product Name
              </th>

              <th className="text-left py-3">
                Price
              </th>

              <th className="text-left py-3">
                Orders
              </th>

              <th className="text-left py-3">
                Stock
              </th>

              <th className="text-left py-3">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((item, index) => (

              <tr
                key={index}
                className="
                border-b border-gray-700
                hover:bg-[#172235]/40
              "
              >

                {/* Product */}
                <td className="py-4">

                  <div className="flex items-center gap-4">

                    <img
                      src={item.img}
                      className="
                      w-10 h-10
                      bg-gray-200 dark:bg-gray-700
                      p-2 rounded
                    "
                    />

                    <div>

                      <div className="text-white">
                        {item.name}
                      </div>

                      <div className="text-gray-400 text-sm">
                        {item.date}
                      </div>

                    </div>

                  </div>

                </td>

                {/* Price */}
                <td className="text-blue-500">
                  {item.price}
                </td>

                {/* Orders */}
                <td className="text-gray-300">
                  {item.orders}
                </td>

                {/* Stock */}
                <td>

                  <span
                    className={`
                    px-3 py-1
                    rounded
                    text-xs
                    ${stockStyle[item.stock]}
                  `}
                  >
                    {item.stock}
                  </span>

                </td>

                {/* Amount */}
                <td className="text-gray-300">
                  {item.amount}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">

        <div>
          Showing 1 to 7 of 14 entries
        </div>

        <div className="flex items-center gap-2">

          <button className="px-3 py-1 hover:text-white">
            ‹
          </button>

          <button
            onClick={() => setPage(1)}
            className={`
            px-3 py-1 rounded
            ${page === 1
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-700"}
          `}
          >
            1
          </button>

          <button
            onClick={() => setPage(2)}
            className={`
            px-3 py-1 rounded
            ${page === 2
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-700"}
          `}
          >
            2
          </button>

          <button className="px-3 py-1 hover:text-white">
            ›
          </button>

        </div>

      </div>

    </div>
  );
}
