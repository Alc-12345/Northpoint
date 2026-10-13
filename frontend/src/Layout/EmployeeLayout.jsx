import { Link } from "react-router-dom";
import EmployeeSidebar from "../Components/EmployeeSidebar";
const EmployeeLayout = ({ children }) => {
  return <EmployeeSidebar><Link className="block p-3 text-blue-600" to="/employee-activity">Attendance & activity controls</Link>{children}</EmployeeSidebar>;
};

export default EmployeeLayout;
