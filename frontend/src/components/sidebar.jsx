import { useState } from "react";
import { 
  Home, 
  Users, 
  Folder, 
  Calendar, 
  FileText, 
  PieChart, 
  ChevronRight 
} from "lucide-react";

export default function Sidebar() {
  const [openTeams, setOpenTeams] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);

  return (
    <div className="h-screen w-64 bg-[#111827] text-gray-300 flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center space-x-2">
        <div className="w-6 h-6 bg-indigo-500 rounded-full"></div>
        <span className="text-lg font-bold">Logo</span>
      </div>

      {/* Navigation */}

      <nav className="px-2 space-y-2 ">
      <div className="flex flex-col gap-5">
        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-md bg-[#1f2937] text-white"
          >
          <Home className="w-10 h-5" />
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#1f2937]"
          >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#1f2937]"
          >
          <FileText className="w-5 h-5" />
          <span>Documents</span>
        </a>

        <a
          href="#"
          className="flex items-center space-x-3 p-2 rounded-md hover:bg-[#1f2937]"
          >
          <PieChart className="w-5 h-5" />
          <span>Reports</span>
        </a>
          </div>
      </nav>
    </div>
  );
}
