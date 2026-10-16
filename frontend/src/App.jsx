import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
const Invoices = lazy(() => import("./Pages/Invoices"));
import Reports from "./Pages/Reports";
import Settings from "./Pages/Settings";
import NotificationCenter from "./Pages/NotificationCenter";
import DocumentEditor from "./Pages/DocumentEditor";
import DocumentLibrary from "./Pages/DocumentLibrary";
import SupportDesk from "./Pages/SupportDesk";
import NotFound from "./Pages/NotFound";
import Monitoring from "./Pages/Monitoring";
import MainLayout from "./Layout/MainLayout";
import Dashboard from "./Pages/Dashboard";
import AllEmployees from "./Pages/AllEmployees";
import EmployeeDetail from "./Components/Employeeinner/EmployeeDetail";
import "./index.css";
import Attendance from "./Pages/Attendance";
import TaskManagement from "./Pages/TaskManagement";
import AddTask from "./Pages/AddTask";
import ProjectManagement from "./Pages/ProjectManagement";
import HrDocuments from "./Pages/HrDocuments";
import AssignProject from "./Pages/AssignProject";
import AdminProjectProgress from "./Pages/AdminProjectProgress";
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
import Charts from "./Pages/Charts";
import Tables from "./Pages/Tables";
import Forms from "./Pages/Forms";
import EmployeeDashboard from "./Pages/EmployeeDashboard";
import EmployeeLayout from "./Layout/EmployeeLayout";
import EmployeeProfile from "./Pages/EmployeeProfile";
import EmployeeProjects from "./Pages/EmployeeProjects";
import EmployeeWorkLog from "./Pages/EmployeeWorkLog";
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
import DeliverablesPage from "./Pages/DeliverablesPage.jsx";
import TimelinePage from "./Pages/Timeline.jsx";
import Feedback from "./Pages/Feedback.jsx";

import CalendarManager from "./Pages/CalendarManager.jsx";
import ETL from "./Pages/ETL.jsx";
import Task from "./Pages/Task.jsx";
import HourBucket from "./Pages/Bucket.jsx";
import Login from "./Pages/Login.jsx";

import TrainingManagement from "./Pages/TrainingManagement.jsx";
import PracticeLab from "./Pages/PracticeLab.jsx";



function App() {
  return (
    <Routes>
      <Route path="/finance/invoices" element={<MainLayout><Suspense fallback={<p className="p-8">Loading invoices…</p>}><Invoices /></Suspense></MainLayout>} />
      <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
      <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
      <Route path="/notifications" element={<MainLayout><NotificationCenter /></MainLayout>} />
      <Route path="/documents/new/:type" element={<MainLayout><DocumentEditor /></MainLayout>} />
      <Route path="/documents" element={<MainLayout><DocumentLibrary admin /></MainLayout>} />
      <Route path="/employee-settings" element={<EmployeeLayout><Settings /></EmployeeLayout>} />
      <Route path="/employee-notifications" element={<EmployeeLayout><NotificationCenter /></EmployeeLayout>} />
      <Route path="/employee-documents" element={<EmployeeLayout><DocumentLibrary /></EmployeeLayout>} />
      <Route path="/employee-help-desk" element={<EmployeeLayout><SupportDesk /></EmployeeLayout>} />
      <Route path="/client/settings" element={<ClientLayout><Settings /></ClientLayout>} />
      <Route path="/client/help-desk" element={<ClientLayout><SupportDesk /></ClientLayout>} />
      <Route path="/client/notifications" element={<ClientLayout><NotificationCenter /></ClientLayout>} />
      <Route path="/monitoring" element={<MainLayout><Monitoring /></MainLayout>} />
      <Route path="/employee-activity" element={<EmployeeLayout><Monitoring employee /></EmployeeLayout>} />
      <Route path="/training/*" element={<TrainingManagement />} />
      <Route path="/student/practice-lab" element={<EmployeeLayout><PracticeLab /></EmployeeLayout>} />

      <Route path="/employee-work-log" element={<EmployeeLayout><EmployeeWorkLog /></EmployeeLayout>} />
      <Route path="/assign-project" element={<MainLayout><AssignProject /></MainLayout>} />
      <Route path="/projects/progress" element={<MainLayout><AdminProjectProgress /></MainLayout>} />
      <Route path="/projects/:id/progress" element={<MainLayout><AdminProjectProgress /></MainLayout>} />
      <Route path="/hr/:type" element={<MainLayout><HrDocuments /></MainLayout>} />
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
        path="/add-teams"
        element={
          <MainLayout>
            <AddTeam />
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
       path="/manage-calendar"
       element={
         <MainLayout>
           <CalendarManager />
         </MainLayout>
       }
     />
     <Route
  path="/assign-task"
  element={
    <MainLayout>
      <AssignTask />
    </MainLayout>
  }
/>
  <Route
  path="/help-desk"
  element={
    <MainLayout>
      <SupportDesk />
    </MainLayout>
  }
/>
 <Route
  path="/projectDetails"
  element={
    <MainLayout>
      <ProjectDetails />
    </MainLayout>
  }
/>



     <Route
       path="/etl"
       element={
        
           <ETL />
         
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
  path="/client/teams"
  element={
    <ClientLayout>
      <AddTeam />
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
  path="/client/tasks"
  element={
    <ClientLayout>
      <Task />
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
<Route
  path="/client/deliverables"
  element={
    <ClientLayout>
      <DeliverablesPage />
    </ClientLayout>
  }
/>  
<Route
  path="/client/Timeline"
  element={
    <ClientLayout>
      <TimelinePage />
    </ClientLayout>
  }
/> 
 <Route
        path="/client/chats"
        element={
          <ClientLayout>
            <ChatPage />
          </ClientLayout>
        }
       /> 
        <Route
        path="/client/Feedback"
        element={
          <ClientLayout>
            <Feedback />
          </ClientLayout>
        }
       /> 
<Route
        path="/client/Notification"
        element={
          <ClientLayout>
            <NotificationCenter />
          </ClientLayout>
        }
       /> 
<Route
  path="/client/hour-bucket"
  element={
    <ClientLayout>
      <HourBucket />
    </ClientLayout>
  }
/>    
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
        path="/employeelogin"
        element={
          
            <Login/>
        
        }
        />     
        <Route
        path="/login"
        element={
          
            <Login/>
        
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
        path="/employee-teams"
        element={
          <EmployeeLayout>
            <AddTeam />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
