import { useState } from "react";
import Header from '../Components/Employeeinner/Header';
import StatCard from '../Components/Employeeinner/StatCard';
import EmployeeGrid from "../Components/Employeeinner/EmployeeGrid";

export default function AllEmployees() {

  const [view, setView] = useState("grid");

  return (
    <div className="p-1">
      
      {/* Header ko props do */}
      <Header view={view} setView={setView} />

      <div className="mt-5">
        <StatCard />
      </div>

      <div className="mt-5">
        {/* view pass karo */}
        <EmployeeGrid view={view} />
      </div>

    </div>
  );
}
