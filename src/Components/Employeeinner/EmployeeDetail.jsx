import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";

export default function EmployeeDetailsPage() {

  const navigate = useNavigate();
  const location = useLocation();
  const emp = location.state;

  const [tab, setTab] = useState("projects");

  // BLOCK STATE
  const [blocked, setBlocked] = useState(false);

  if (!emp) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        No employee data
      </div>
    );
  }

  return (
    <div className="
      max-w-7xl mx-auto p-6 space-y-6
      bg-gray-100 dark:bg-[#0b1220]
      min-h-screen transition-colors
      border-b
    ">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/employees/all")}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            <FiArrowLeft size={18}/>
          </button>

          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">
            Employee Details
          </h2>

        </div>

        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg">
          Bank & Statutory
        </button>

      </div>


      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">


        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 space-y-6">


          {/* PROFILE CARD */}
          <div className="bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#243244] rounded-xl overflow-hidden">

            <div className="h-24 bg-gradient-to-r from-orange-500 to-yellow-500"></div>

            <div className="flex flex-col items-center -mt-12 p-6">

              <img
                src={emp.avatar}
                className="w-20 h-20 rounded-full border-4 border-white dark:border-[#0b1220]"
              />

              <h2 className="mt-3 text-gray-900 dark:text-white font-semibold">
                {emp.name}
              </h2>

              <span className="bg-purple-100 dark:bg-purple-600 text-purple-600 dark:text-white text-xs px-3 py-1 rounded mt-2">
                {emp.role}
              </span>

              {/* STATUS BADGE */}
              <span
                className={`text-xs px-3 py-1 rounded mt-2 
                ${blocked
                  ? "bg-red-100 text-red-600 dark:bg-red-600 dark:text-white"
                  : "bg-green-100 text-green-600 dark:bg-green-600 dark:text-white"
                }`}
              >
                {blocked ? "Blocked" : "Active"}
              </span>

            </div>


            <div className="px-6 pb-6 space-y-3">

              <InfoRow label="Employee ID" value="EMP-0001"/>
              <InfoRow label="Team" value="UI/UX Design"/>
              <InfoRow label="Date Of Join" value="1st Jan 2023"/>
              <InfoRow label="Report Office" value="Douglas Martini"/>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg mt-3">
                Message
              </button>

              {/* BLOCK BUTTON */}
              <button
                onClick={() => setBlocked(!blocked)}
                className={`w-full py-2 rounded-lg text-white
                ${blocked
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {blocked ? "Unblock Employee" : "Block Employee"}
              </button>

            </div>

          </div>


          {/* BASIC INFORMATION */}
          <Card title="Basic information">

            <InfoRow label="Phone" value="+1 458 787 878"/>
            <InfoRow label="Email" value="peralt12@example.com" blue/>
            <InfoRow label="Gender" value="Male"/>
            <InfoRow label="Birthday" value="24th July 2000"/>
            <InfoRow label="Address" value="Manchester, NJ"/>

          </Card>


          {/* PERSONAL INFORMATION */}
          <Card title="Personal Information">

            <InfoRow label="Passport No" value="QRET4566FGRT"/>
            <InfoRow label="Passport Exp Date" value="15 May 2029"/>
            <InfoRow label="Nationality" value="Indian"/>
            <InfoRow label="Religion" value="Christianity"/>
            <InfoRow label="Marital status" value="Yes"/>
            <InfoRow label="Employment of spouse" value="No"/>
            <InfoRow label="No. of children" value="2"/>

          </Card>


          {/* EMERGENCY CONTACT */}
          <Card title="Emergency Contact Number">

            <ContactRow
              name="Adrian Peralt"
              relation="Father"
              phone="+1 127 2685 598"
            />

            <ContactRow
              name="Karen Wills"
              relation="Mother"
              phone="+1 989 7774 787"
            />

          </Card>

        </div>


        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 space-y-6">


          {/* ABOUT */}
          <Card title="About Employee">

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              As an award winning designer, I deliver exceptional quality work and bring value to your brand!
              With 10 years of experience and 350+ projects completed worldwide with satisfied customers,
              I developed the 360° brand approach.
            </p>

          </Card>


          {/* BANK */}
          <Card title="Bank Information">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              <InfoCol label="Bank name" value="Swiz International Bank"/>
              <InfoCol label="Account no" value="159843014641"/>
              <InfoCol label="IFSC Code" value="ICI24504"/>
              <InfoCol label="Branch" value="Alabama USA"/>

            </div>

          </Card>


          {/* FAMILY */}
          <Card title="Family Information">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

              <InfoCol label="Name" value="Hendry Peralt"/>
              <InfoCol label="Relationship" value="Brother"/>
              <InfoCol label="Date of birth" value="25 May 2014"/>
              <InfoCol label="Phone" value="+1 265 6956 961"/>

            </div>

          </Card>


          {/* EDUCATION & EXPERIENCE */}
          <div className="grid md:grid-cols-2 gap-6">


            <Card title="Education Details">

              <Timeline title="Oxford University" subtitle="Computer Science" date="2020 - 2022"/>
              <Timeline title="Cambridge University" subtitle="Computer Network & Systems" date="2016 - 2019"/>
              <Timeline title="Oxford School" subtitle="Grade X" date="2012 - 2016"/>

            </Card>


            <Card title="Experience">

              <Experience company="Google" role="UI/UX Developer" date="Jan 2013 - Present"/>
              <Experience company="Salesforce" role="Web Developer" date="Dec 2012 - Jan 2015"/>
              <Experience company="HubSpot" role="Product Designer" date="Dec 2011 - Jan 2012"/>

            </Card>

          </div>

        </div>

      </div>

    </div>
  );
}


/* COMPONENTS */

function Card({title,children}) {
  return (
    <div className="bg-white dark:bg-[#0b1220] border border-gray-200 dark:border-[#243244] rounded-xl">

      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#243244] text-gray-900 dark:text-white font-semibold text-sm">
          {title}
        </div>
      )}

      <div className="p-6 space-y-3">
        {children}
      </div>

    </div>
  );
}


function InfoRow({label,value,blue}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className={blue ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-900 dark:text-gray-100 font-medium"}>
        {value}
      </span>
    </div>
  );
}


function InfoCol({label,value}) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value}</p>
    </div>
  );
}


function ContactRow({name,relation,phone}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-900 dark:text-gray-100 font-medium">{name} • {relation}</span>
      <span className="text-gray-600 dark:text-gray-400">{phone}</span>
    </div>
  );
}


function Timeline({title,subtitle,date}) {
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
    </div>
  );
}


function Experience({company,role,date}) {
  return (
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{company}</p>
        <span className="text-xs bg-blue-100 dark:bg-blue-600 text-blue-600 dark:text-white px-2 py-0.5 rounded">
          {role}
        </span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
    </div>
  );
}
