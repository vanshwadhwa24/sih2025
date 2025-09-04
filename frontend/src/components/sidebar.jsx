import { useState } from "react";
import { Link } from "react-router-dom";
import { Map, MapPin, MapPinned } from "lucide-react";
import { 
  Home, 
  Calendar, 
  FileText, 
  PieChart
} from "lucide-react";

export default function Sidebar() {
  const [openTeams, setOpenTeams] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);

  return (

  <div className="h-screen bg-[#0f172a] text-gray-300 flex flex-col border-r-2 border-[#fafafa] pr-20">
      {/* Logo */}
      <div className="p-4 flex items-center space-x-2">
        <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
        <span className="text-lg font-bold">Logo</span>
      </div>

      {/* Navigation */}
      <nav className="px-2 space-y-2">
        <div className="flex flex-col gap-5">

          {/* Dashboard */}
          <Link
            to="/"
            className="flex items-center space-x-3 p-2 rounded-md bg-[#1f2937] text-white"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          {/* Map Dashboard */}
          <Link
            to="/map_dashboard"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#1f2937]"
          >
            <Map className="w-5 h-5" />
            <span>Map Dashboard</span>
          </Link>

          {/* police_dashboard */}
          <Link
            to="/Police_dashboard"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#1f2937]"
          >
            <FileText className="w-5 h-5" />
            <span>police</span>
          </Link>

          {/* Reports */}
          <Link
            to="/reports"
            className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#1f2937]"
          >
            <PieChart className="w-5 h-5" />
            <span>Reports</span>
          </Link>

        </div>
      </nav>
    </div>
  );
}
