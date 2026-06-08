import { Routes, Route, Form } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import AllEmployees from "./Pages/AllEmployees";
import EmployeeDetail from "./Components/Employeeinner/EmployeeDetail";
import "./index.css";
import Attendance from "./Pages/Attendance";
import TaskManagement from "./Pages/TaskManagement";
import AddTask from "./Pages/AddTask";
import ProjectManagement from "./Pages/ProjectManagement";
import AddProject from "./Pages/AddProject";
import ClientBillingFinance from "./Pages/ClientBillingFinance";
import PayrollPage from "./Pages/Payroll";
import AssetManagementPage from "./Pages/AssetManagement";
import Assign from "./Pages/Assign"; 
import ClientManagement from "./Pages/ClientManagement"; 
import ClientDashboard from "./Pages/ClientDashboard";
import AddClient from "./Pages/AddClient";  
import ProjectDetails from "./Pages/ProjectDetails";
import AddEmployee from "./Pages/AddEmployee";  
import Apps from "./Pages/Apps";
import Charts from "./Pages/Charts";

import Tables from "./Pages/Tables";
import Forms from "./Pages/Forms";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import EmployeeLayout from "./Layout/EmployeeLayout";
import EmployeeProfile from "./Pages/EmployeeProfile";
import EmployeeProjects from "./Pages/EmployeeProjects";
import EmployeeTasks from "./Pages/EmployeeTasks";
import EmployeeCalendar from "./Pages/EmployeeCalendar.jsx";
import EmployeeAttendance from "./Pages/EmployeeAttendance.jsx";
import EmployeeLeave from "./Pages/EmployeeLeave.jsx";
import EmployeeMessages from "./Pages/EmployeeMessages.jsx";
import Salary from "./Pages/Salary.jsx";
import ChatPage from "./Pages/ChatPage.jsx"; 
import AddTeam from "./Pages/AddTeam.jsx";
import ClientLayout from "./Layout/ClientLayout";
import AssignTask from "./Pages/AssignTask.jsx";
import Finance from "./Pages/Finance.jsx";
import ProjectProgress from "./Pages/ProjectProgress.jsx";


function App() {
  return (
    <Routes>

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      {/* All Employees */}
      <Route
        path="/employees/all"
        element={
          <MainLayout>
            <AllEmployees />
          </MainLayout>
        }
      />
        <Route
        path="/employees/add"
        element={
          <MainLayout>
            <AddEmployee />
          </MainLayout>
        }
       /> 

      {/* Employee Details Page */}
      <Route
        path="/employees/:id"
        element={
          <MainLayout>
            <EmployeeDetail />
          </MainLayout>
        }
      />
      
      {/* All Employees */}
      <Route
        path="/employees/attendance"
        element={
          <MainLayout>
            <Attendance />
          </MainLayout>
        }
      />
      <Route
        path="/tasks"
        element={
          <MainLayout>
            <TaskManagement />
          </MainLayout>
        }
      />  
      <Route
        path="/add-task"
        element={
          <MainLayout>
            <AddTask />
          </MainLayout>
        }
       />
        <Route
        path="/projects"
        element={
          <MainLayout>
            <ProjectManagement />
          </MainLayout>
        }
       /> 
        <Route
        path="/add-project"
        element={
          <MainLayout>
            <AddProject />  
          </MainLayout>
        }
       />
       <Route
        path="/client-billing-finance"
        element={
          <MainLayout>
            <ClientBillingFinance />
          </MainLayout>
        }
       />
       <Route
        path="/payroll"
        element={
          <MainLayout>
            <PayrollPage />
          </MainLayout>
        }
       />
       <Route
        path="/salary"
        element={
          <MainLayout>
            <Salary />
          </MainLayout>
        }
       />
        <Route
        path="/asset-management"
        element={
          <MainLayout>
            <AssetManagementPage />
          </MainLayout>
        }
       /> 
        <Route
        path="/assign"
        element={
          <MainLayout>
            <Assign />
          </MainLayout>
        }
       />
        <Route
        path="/clients"
        element={
          <MainLayout>
            <ClientManagement />
          </MainLayout>
        }
       /> 
        
        <Route
        path="/clients/add"
        element={
          <MainLayout>
            <AddClient />
          </MainLayout>
        }
       /> 
    
<Route
  path="/client/dashboard"
  element={
    <ClientLayout>
      <ClientDashboard />
    </ClientLayout>
  }
/>

<Route
  path="/client/add-team"
  element={
    <ClientLayout>
      <AddTeam />
    </ClientLayout>
  }
/>

 <Route
  path="/client/assign-task"
  element={
    <ClientLayout>
      <AssignTask />
    </ClientLayout>
  }
/>

<Route
  path="/client/finance"
  element={
    <ClientLayout>
      <Finance />
    </ClientLayout>
  }
/>
<Route
  path="/client/project-progress"
  element={
    <ClientLayout>
      <ProjectProgress />
    </ClientLayout>
  }
/>

{/* <Route
  path="/client/hour-bucket"
  element={
    <ClientLayout>
      <HourBucket />
    </ClientLayout>
  }
/>     */}
  <Route
        path="/projects/:id"
        element={
          <MainLayout>
            <ProjectDetails />
          </MainLayout>
        }
       />
        <Route
        path="/chats"
        element={
          <MainLayout>
            <ChatPage />
          </MainLayout>
        }
       />  
        <Route
        path="/apps"
        element={
          <MainLayout>
            <Apps />
          </MainLayout>
        }
       />  
        <Route
        path="/charts"
        element={
          <MainLayout>
            <Charts />
          </MainLayout>
        }
       />
      
        <Route
        path="/tables"
        element={
          <MainLayout>
            <Tables />
          </MainLayout>
        }
       />
        <Route
        path="/forms"
        element={
          <MainLayout>
            <Forms />
          </MainLayout>
        }
       />     
       <Route
        path="/employee-dashboard"
        element={
          <EmployeeLayout>
            <EmployeeDashboard />
          </EmployeeLayout>
        }
        /> 
        <Route
        path="/employee-profile"
        element={
          <EmployeeLayout>
            <EmployeeProfile />
          </EmployeeLayout>
        }
       />
        <Route
        path="/employee-projects"
        element={
          <EmployeeLayout>
            <EmployeeProjects />
          </EmployeeLayout>
        }
       /> 
        <Route
        path="/employee-tasks"
        element={
          <EmployeeLayout>
            <EmployeeTasks />
          </EmployeeLayout>
        }
       />
         <Route
        path="/employee-calendar"
        element={
          <EmployeeLayout>
            <EmployeeCalendar />
          </EmployeeLayout>
        }
       />     
        <Route
        path="/employee-attendance"
        element={
          <EmployeeLayout>
            <EmployeeAttendance />
          </EmployeeLayout>
        }
       />
       <Route
        path="/employee-leave"
        element={
          <EmployeeLayout>
            <EmployeeLeave />
          </EmployeeLayout>
        }
       />
        <Route
        path="/employee-messages"
        element={
          <EmployeeLayout>
            <EmployeeMessages />
          </EmployeeLayout>
        }
       /> 
    </Routes>
  );
}

export default App;
