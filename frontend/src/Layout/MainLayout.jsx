import { Navigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";

const MainLayout = ({ children }) => {
  if (!localStorage.getItem("authToken")) return <Navigate to="/login" replace />;
  return <Sidebar>{children}</Sidebar>;
};

export default MainLayout;
