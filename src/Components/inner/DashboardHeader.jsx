import { FiPlus, FiBell, FiSettings } from "react-icons/fi";


export default function DashboardHeader() {


  return (
    <div className="w-full h-16 px-6 py-4 flex items-center justify-between ">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-sm text-white">
          Dashboard
        </span>
        <span className="text-gray-400">   </span>
        <span className="text-gray-400">
          Home
        </span>
        <span className="text-gray-400">/</span>
        <span className="text-[#18A8E6] font-medium">
          Dashboard
        </span>
      </div>

      
    </div>
  );
}
