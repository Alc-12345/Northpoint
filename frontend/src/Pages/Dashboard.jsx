import StatCard from "../components/inner/StatCard";
import ProjectOverview from "../components/inner/ProjectOverview";
import MyTodo from "../components/inner/MyTodo";
import TotalEarning from "../components/inner/TotalEarning";
import DashboardHeader from "../components/inner/DashboardHeader";
import ActiveProjects from "../components/inner/ActiveProjects";
import ActiveUser from "../components/inner/ActiveUser";
import Chat from "../components/inner/Chat";
import BestSellingProducts from "../components/inner/BestSellingProducts";
import UpcomingSchedules from "../components/inner/UpcomingSchedules";
import ProjectStatus from "../components/inner/ProjectStatus";
import Employees from "../components/inner/Employees";

export default function Dashboard() {
  return (
    <div className=" admin-dashboard min-h-screen bg-gray-100 text-gray-900 dark:bg-[#0b1220] dark:text-white ">
    
      <div className="w-full px-6 py-8 bg-gray-100 dark:bg-[#0b1220]">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-9">
            <StatCard />
          </div>

          <div className="col-span-3 row-span-2">
            <TotalEarning />
          </div>

          <div className="col-span-6">
            <ProjectOverview />
          </div>

          <div className="col-span-3">
            <MyTodo />
          </div>

          <div className="col-span-12">
            <ActiveProjects />
          </div>
          <div className="col-span-4">
            <ProjectStatus />
          </div>

          {/* <div className="col-span-8">
            <BestSellingProducts />
          </div> */}

            <div className="col-span-8">
            <Employees />
          </div>

       

         

          <div className="col-span-4">
            <UpcomingSchedules />
          </div>

          
          <div className="col-span-4">
            <Chat />
          </div>

        
        </div>
      </div>
    </div>
  );
}
