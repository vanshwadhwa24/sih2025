import React, { useState } from "react";
import FloatingSidebar from "../components/Sidebar";
import FullScreenNavbar from "../components/Navbar";
import {
  Shield,
  AlertTriangle,
  PhoneCall,
  Flame,
  HeartPulse,
  Baby,
} from "lucide-react";

const typeIcons = {
  Police: <Shield size={22} className="text-blue-400" />,
  Hospital: <HeartPulse size={22} className="text-pink-400" />,
  Fire: <Flame size={22} className="text-red-400" />,
  WomenHelpline: <PhoneCall size={22} className="text-purple-400" />,
  ChildHelpline: <Baby size={22} className="text-yellow-400" />,
};

const typeColors = {
  Police: "bg-blue-900",
  Hospital: "bg-pink-900",
  Fire: "bg-red-900",
  WomenHelpline: "bg-purple-900",
  ChildHelpline: "bg-yellow-900",
};

export default function Alert() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Example static alerts data
  const [alerts] = useState([
    {
      id: 1,
      type: "Police",
      message: "Robbery reported near Main Street.",
      time: "2 min ago",
      location: "Main Street",
    },
    {
      id: 2,
      type: "Hospital",
      message: "Medical emergency at City Mall.",
      time: "10 min ago",
      location: "City Mall",
    },
    {
      id: 3,
      type: "Fire",
      message: "Fire outbreak at Riverside Apartments.",
      time: "20 min ago",
      location: "Riverside Apartments",
    },
    {
      id: 4,
      type: "WomenHelpline",
      message: "Assistance requested near Park Avenue.",
      time: "30 min ago",
      location: "Park Avenue",
    },
    {
      id: 5,
      type: "ChildHelpline",
      message: "Lost child found at Central Station.",
      time: "45 min ago",
      location: "Central Station",
    },
  ]);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #262d36 60%, #1a202c 100%)",
      }}
    >
      {/* Navbar */}
      <FullScreenNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar */}
      <FloatingSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="pt-24 pl-60 pr-6 pb-6">
        <div className="space-y-6">
          {/* Alerts Card */}
          <div className="bg-[#222932] rounded-2xl p-8 text-white shadow-2xl border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl flex items-center gap-2">
                <AlertTriangle size={26} className="text-yellow-400" />
                Recent SOS Alerts
              </h2>
            </div>
            <div className="divide-y divide-gray-800">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="py-5 px-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all duration-200 hover:bg-[#232a34] rounded-xl"
                  style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)" }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-12 h-12 flex items-center justify-center rounded-full ${typeColors[alert.type]} bg-opacity-80 shadow-lg border-2 border-gray-700`}
                    >
                      {typeIcons[alert.type]}
                    </span>
                    <div>
                      <span className="font-semibold text-base block">
                        {alert.type}
                      </span>
                      <span className="text-gray-300 text-sm block mt-1">
                        {alert.message}
                      </span>
                      <span className="text-gray-500 text-xs block mt-1">
                        <strong>Location:</strong> {alert.location}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end mt-2 md:mt-0 gap-2">
                    <span className="text-gray-400 text-sm font-medium">
                      {alert.time}
                    </span>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition-all duration-150"
                      style={{ minWidth: "80px", letterSpacing: "1px" }}
                    >
                      E-FIR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}