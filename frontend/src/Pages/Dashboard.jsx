import { useState } from "react";
import { useEffect   } from "react";
import { CircleMarker, Tooltip } from "react-leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AlertCircle, CheckCircle, Users, ClipboardCheck } from "lucide-react";
import FloatingSidebar from "../components/Sidebar";
import FullScreenNavbar from "../components/Navbar";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('/locations.json')
      .then(res => res.json())
      .then(data => setLocations(data));
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: '#262d36' }}>
      {/* Navbar at top */}
      <div className="w-full sticky top-0 z-30">
        <FullScreenNavbar />
      </div>
      <div className="flex flex-1">
        {/* Sidebar on left */}
        <div className="w-56 min-w-[180px] bg-[#222932] border-r border-gray-700">
          <FloatingSidebar isOpen={true} />
        </div>
        {/* Map in center */}
        <div className="flex-1 relative">
          <MapContainer center={[28.6139, 77.2090]} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            {locations.map(user => (
              <CircleMarker
                key={user.id}
                center={[user.lat, user.lng]}
                radius={6}
                pathOptions={{
                  color:"none",
                  fillColor: 'red',
                  fillOpacity: 0.7,
                }}
                className="leaflet-glow-dot"
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                  <div>
                    <strong>{user.name}</strong><br />
                    {user.location}
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        {/* Info cards on right */}
        <div className="w-80 min-w-[260px] max-w-[350px] bg-[#222932] border-l border-gray-700 p-4 overflow-y-auto flex flex-col gap-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-[#262d36] text-white rounded-lg p-2 border border-gray-600 flex flex-col items-center">
              <AlertCircle size={20} className="text-red-400" />
              <span className="text-base font-light">23</span>
              <span className="text-xs text-gray-400">Active Alerts</span>
            </div>
            <div className="bg-[#262d36] text-white rounded-lg p-2 border border-gray-600 flex flex-col items-center">
              <CheckCircle size={20} className="text-green-400" />
              <span className="text-base font-light">1,247</span>
              <span className="text-xs text-gray-400">Safe Check-ins</span>
            </div>
            <div className="bg-[#262d36] text-white rounded-lg p-2 border border-gray-600 flex flex-col items-center">
              <Users size={20} className="text-blue-400" />
              <span className="text-base font-light">3,892</span>
              <span className="text-xs text-gray-400">Tourists</span>
            </div>
            <div className="bg-[#262d36] text-white rounded-lg p-2 border border-gray-600 flex flex-col items-center">
              <ClipboardCheck size={20} className="text-purple-400" />
              <span className="text-base font-light">156</span>
              <span className="text-xs text-gray-400">Cases Resolved</span>
            </div>
          </div>
          {/* Alerts */}
          <div className="flex flex-col gap-2">
            <div className="bg-[#262d36] rounded-lg shadow p-2 border border-gray-600">
              <p className="text-xs font-medium text-red-400">High Priority</p>
              <p className="text-xs text-white">Emergency SOS - Central Park</p>
              <div className="flex gap-1 mt-2">
                <button className="bg-red-600 hover:bg-red-700 px-2 py-0.5 rounded text-white text-xs transition-colors">View</button>
                <button className="bg-gray-700 hover:bg-gray-600 px-2 py-0.5 rounded text-white text-xs transition-colors">Assign</button>
              </div>
            </div>
            <div className="bg-[#262d36] rounded-lg shadow p-2 border border-gray-600">
              <p className="text-xs font-medium text-green-400">Low Priority</p>
              <p className="text-xs text-white">Check-in - Grand Hotel</p>
              <div className="flex gap-1 mt-2">
                <button className="bg-green-600 hover:bg-green-700 px-2 py-0.5 rounded text-white text-xs transition-colors">View</button>
                <button className="bg-gray-700 hover:bg-gray-600 px-2 py-0.5 rounded text-white text-xs transition-colors">Assign</button>
              </div>
            </div>
          </div>
          {/* Charts */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="bg-[#262d36] rounded-lg shadow p-2 border border-gray-600">
              <h3 className="text-xs font-semibold text-white mb-1">Incidents Over Time</h3>
              <div className="h-16 flex items-center justify-center text-gray-400 bg-gray-700/20 rounded">
                <span className="text-xs">Chart</span>
              </div>
            </div>
            <div className="bg-[#262d36] rounded-lg shadow p-2 border border-gray-600">
              <h3 className="text-xs font-semibold text-white mb-1">Incident Types</h3>
              <div className="h-16 flex items-center justify-center text-gray-400 bg-gray-700/20 rounded">
                <span className="text-xs">Chart</span>
              </div>
            </div>
            <div className="bg-[#262d36] rounded-lg shadow p-2 border border-gray-600">
              <h3 className="text-xs font-semibold text-white mb-1">Tourist Demographics</h3>
              <div className="h-16 flex items-center justify-center text-gray-400 bg-gray-700/20 rounded">
                <span className="text-xs">Pie</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
