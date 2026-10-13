import { Navigate } from "react-router-dom";
import ActivityNotifications from "../Components/ActivityNotifications";
import Sidebar from "../Components/Sidebar";
import { isPanelPreview } from "../utils/auth";

const MainLayout = ({ children }) => {
  if (!localStorage.getItem("authToken") && !isPanelPreview()) return <Navigate to="/login" replace />;
  return <Sidebar><ActivityNotifications />{children}</Sidebar>;
};

export default MainLayout;
