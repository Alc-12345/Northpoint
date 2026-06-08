import Sidebar from "../Components/Sidebar";

const MainLayout = ({ children }) => {
  return <Sidebar>{children}</Sidebar>;
};

export default MainLayout;
