import { useState } from "react";
import { MapPin, Shield, AlertTriangle } from "lucide-react";
import Sidebar from "../components/sidebar";

export default function Map_dashboard() {
  const [location, setLocation] = useState("");
  return (
      <div className="flex my-5 gap-10 ">
<div>
    <Sidebar/>
</div>
    <div>
    <div className="  bg-[#0f172a] min-h-screen text-white w-fit ">
      {/* Main Content */}
      <div className="col-span-10 space-y-6  align-center ">
        {/* Tourist Status Card */}
        <div className=" bg-[#0f172a]  rounded-xl p-4">
          <h2 className="font-semibold text-lg">Tourist Status</h2>
          <p className="text-green-500 font-bold">You are Safe</p>
          <span className="text-gray-400 text-sm">
            Current Location: Times Square
          </span>
        </div>
            <div className="flex flex-col gap-10 items-center align-middle ">
          <div className=" flex gap-3 justify-center">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
              <Shield size={16} /> Check-in Safe
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
              <Shield size={16} /> Contact Police
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
              <AlertTriangle size={16} /> Report Incident
            </button>
          </div>
        {/* Map Placeholder */}
        <div className=" w-[40vw] h-[20vh] bg-gray-300 flex items-center justify-center rounded-lg">
          <p className="text-gray-700">[ Map will render here ]</p>

          {/* Buttons on top of the map */}

          {/* SOS Floating Button */}
        </div>

        {/* Search bar at bottom */}
        <div >
          <input
            type="text"
            placeholder="Search for location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-gray-200 px-4 py-2 border border-gray-300 rounded-lg shadow text-black"
            />
        </div>

        {/* Bottom Navigation */}
        <span className="bg-[#1e293b] flex justify-around w-90 py-10 rounded-lg">
          <button className="flex flex-col items-center text-gray-300 hover:text-white">
            <MapPin size={18} /> <span className="text-xs">Map</span>
          </button>
          <button className="flex flex-col items-center text-gray-300 hover:text-white">
            <AlertTriangle size={18} /> <span className="text-xs">Alerts</span>
          </button>
          <button className="flex flex-col items-center text-gray-300 hover:text-white">
            <Shield size={18} /> <span className="text-xs">Profile</span>
          </button>

          </span>
          <button className="absolute bottom-10 right-10 bg-red-500 text-white font-bold text-lg rounded-full shadow-xl px-6 py-4">
            SOS
          </button>
        </div>
      </div>
    </div>
            </div>
            </div>
  );
}
