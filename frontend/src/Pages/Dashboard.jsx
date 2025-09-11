import { useState } from "react";
import { AlertCircle, CheckCircle, Users, ClipboardCheck } from "lucide-react";
import FloatingSidebar from "../components/Sidebar";
import FullScreenNavbar from "../components/Navbar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#262d36' }}>
      {/* Navbar */}
      <FullScreenNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <FloatingSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="pt-24 pl-60 pr-6 pb-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-[#222932] text-white rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center justify-between">
                <AlertCircle size={32} className="text-red-400" />
                <span className="text-3xl font-light">23</span>
              </div>
              <p className="mt-3 text-gray-300">Active Alerts</p>
            </div>

            <div className="bg-[#222932] text-white rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center justify-between">
                <CheckCircle size={32} className="text-green-400" />
                <span className="text-3xl font-light">1,247</span>
              </div>
              <p className="mt-3 text-gray-300">Safe Check-ins Today</p>
            </div>

            <div className="bg-[#222932] text-white rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center justify-between">
                <Users size={32} className="text-blue-400" />
                <span className="text-3xl font-light">3,892</span>
              </div>
              <p className="mt-3 text-gray-300">Tourists Monitored</p>
            </div>

            <div className="bg-[#222932] text-white rounded-2xl p-6 border border-gray-600">
              <div className="flex items-center justify-between">
                <ClipboardCheck size={32} className="text-purple-400" />
                <span className="text-3xl font-light">156</span>
              </div>
              <p className="mt-3 text-gray-300">Cases Resolved</p>
            </div>
          </div>

          {/* Map + Alerts */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-8 bg-[#222932] rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Live Map</h3>
              <div className="h-96 bg-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-700 text-lg">[ Heatmap will render here ]</p>
              </div>
            </div>

            <div className="col-span-4 bg-[#222932] rounded-2xl shadow-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold mb-4 text-white">Live Alerts</h3>
              
              <div className="p-4 border border-gray-600 rounded-xl bg-red-900/20">
                <p className="text-sm font-medium text-red-400">High Priority</p>
                <p className="text-sm text-white mt-1">Emergency SOS - Central Park</p>
                <div className="flex gap-2 mt-3">
                  <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white text-sm transition-colors">
                    View
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-white text-sm transition-colors">
                    Assign
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-600 rounded-xl bg-green-900/20">
                <p className="text-sm font-medium text-green-400">Low Priority</p>
                <p className="text-sm text-white mt-1">Check-in - Grand Hotel</p>
                <div className="flex gap-2 mt-3">
                  <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-lg text-white text-sm transition-colors">
                    View
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg text-white text-sm transition-colors">
                    Assign
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#222932] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 text-white">Incidents Over Time</h3>
              <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-700/20 rounded-lg">
                <span>Chart Placeholder</span>
              </div>
            </div>

            <div className="bg-[#222932] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 text-white">Incident Types Distribution</h3>
              <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-700/20 rounded-lg">
                <span>Chart Placeholder</span>
              </div>
            </div>

            <div className="bg-[#222932] rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 text-white">Tourist Demographics</h3>
              <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-700/20 rounded-lg">
                <span>Pie Chart Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
