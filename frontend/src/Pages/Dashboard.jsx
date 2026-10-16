import StatCard from "../Components/inner/StatCard";
import ProjectOverview from "../Components/inner/ProjectOverview";
import MyTodo from "../Components/inner/MyTodo";
import TotalEarning from "../Components/inner/TotalEarning";
import DashboardHeader from "../Components/inner/DashboardHeader";
import ActiveProjects from "../Components/inner/ActiveProjects";
import ActiveUser from "../Components/inner/ActiveUser";
import Chat from "../Components/inner/Chat";
import BestSellingProducts from "../Components/inner/BestSellingProducts";
import UpcomingSchedules from "../Components/inner/UpcomingSchedules";
import ProjectStatus from "../Components/inner/ProjectStatus";
import Employees from "../Components/inner/Employees";

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
