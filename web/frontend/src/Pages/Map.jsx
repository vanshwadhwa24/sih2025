import { useState } from "react";
import { MapPin, Shield, AlertTriangle } from "lucide-react";
import FloatingSidebar from "../components/Sidebar";
import FullScreenNavbar from "../components/Navbar";

export default function Map_dashboard() {
  const [location, setLocation] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#262d36" }}>
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
          {/* Tourist Status Card */}
          <div className="bg-[#222932] rounded-xl p-6 text-white">
            <h2 className="font-semibold text-lg">Tourist Status</h2>
            <p className="text-green-500 font-bold">You are Safe</p>
            <span className="text-gray-400 text-sm">
              Current Location: Times Square
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow flex items-center gap-2 hover:bg-green-600 transition-colors">
              <Shield size={16} /> Check-in Safe
            </button>
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow flex items-center gap-2 hover:bg-blue-600 transition-colors">
              <Shield size={16} /> Contact Police
            </button>
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow flex items-center gap-2 hover:bg-yellow-600 transition-colors">
              <AlertTriangle size={16} /> Report Incident
            </button>
          </div>

          {/* Map Section */}
          <div className="bg-[#222932] rounded-xl p-6">
            <div className="w-full h-96 bg-gray-300 flex items-center justify-center rounded-lg mb-4">
              <p className="text-gray-700 text-lg">[ Map will render here ]</p>
            </div>

            {/* Search bar */}
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Search for location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-gray-200 px-4 py-3 border border-gray-300 rounded-lg shadow text-black w-80"
              />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="bg-[#222932] rounded-xl p-6">
            <div className="flex justify-around">
              <button className="flex flex-col items-center text-gray-300 hover:text-white transition-colors">
                <MapPin size={24} />
                <span className="text-sm mt-1">Map</span>
              </button>
              <button className="flex flex-col items-center text-gray-300 hover:text-white transition-colors">
                <AlertTriangle size={24} />
                <span className="text-sm mt-1">Alerts</span>
              </button>
              <button className="flex flex-col items-center text-gray-300 hover:text-white transition-colors">
                <Shield size={24} />
                <span className="text-sm mt-1">Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* SOS Floating Button */}
        <button className="fixed bottom-8 right-8 bg-red-500 text-white font-bold text-xl rounded-full shadow-xl px-8 py-4 hover:bg-red-600 transition-colors z-30">
          SOS
        </button>
      </div>
    </div>
  );
}
