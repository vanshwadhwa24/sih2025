import React from "react";
import { MapPin, AlertCircle, CheckCircle, Users, ClipboardCheck } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-6 grid grid-cols-12 gap-6 bg-[#0f172a] min-h-screen text-white w-screen pl-115">
    

      {/* Main Content */}
      <div className="col-span-10 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6">
          {/* Card */}
          <div className="bg-solid-600 text-white rounded-2xl p-4 border-3 border-[#f2f2f2]">
            <div className="flex items-center justify-between">
              <AlertCircle size={28} />
              <span className="text-3xl font-light">23</span>
            </div>
            <p className="mt-2">Active Alerts</p>
          </div>

            <div className="bg-solid-600 text-white rounded-2xl p-4 border-3 border-[#f2f2f2]">
            <div className="flex items-center justify-between">
              <CheckCircle size={28} />
              <span className="text-3xl font-light">1,247</span>
            </div>
            <p className="mt-2">Safe Check-ins Today</p>
          </div>

            <div className="bg-solid-600 text-white rounded-2xl p-4 border-3 border-[#f2f2f2]">
            <div className="flex items-center justify-between">
              <Users size={28} />
              <span className="text-3xl font-light">3,892</span>
            </div>
            <p className="mt-2">Tourists Monitored</p>
          </div>

            <div className="bg-solid-600 text-white rounded-2xl p-4 border-3 border-[#f2f2f2]">
            <div className="flex items-center justify-between">
              <ClipboardCheck size={28} />
              <span className="text-3xl font-light">156</span>
            </div>
            <p className="mt-2">Cases Resolved</p>
          </div>
        </div>

        {/* Map + Alerts */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-[#1e293b] rounded-2xl shadow-lg p-2">
            {/* <img
              src="/map-heat.png"
              alt="Heatmap"
              className="rounded-xl w-full h-[400px] object-cover"
            /> */}
          </div>

          <div className="col-span-4 bg-[#1e293b] rounded-2xl shadow-lg p-4 space-y-4">
            <h3 className="text-lg font-semilight mb-2">Live Alerts</h3>
            <div className="p-3 border-3 border-[#f2f2f2] rounded-xl">
              <p className="text-sm font-light">High</p>
              <p className="text-sm">Emergency SOS - Central Park</p>
              <div className="flex gap-2 mt-2">
                <button className="bg-red-600 px-3 py-1 rounded-lg">View</button>
                <button className="bg-gray-700 px-3 py-1 rounded-lg">Assign</button>
              </div>
            </div>
            <div className="p-3 border-3 border-[#f2f2f2] rounded-xl">
              <p className="text-sm font-light">Low</p>
              <p className="text-sm">Check-in - Grand Hotel</p>
              <div className="flex gap-2 mt-2">
                <button className="bg-green-600 px-3 py-1 rounded-lg">View</button>
                <button className="bg-gray-700 px-3 py-1 rounded-lg">Assign</button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-[#1e293b] rounded-2xl shadow-lg p-4">
            <h3 className="font-semilight mb-2">Incidents Over Time</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">
              ----------------------
            </div>
            {/* <p className="mt-2 text-red-400">Overall Risk Level: Moderate</p> */}
          </div>

          <div className="bg-[#1e293b] rounded-2xl shadow-lg p-4">
            <h3 className="font-semilight mb-2">Incident Types Distribution</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">
              Chart Placeholder
            </div>
            {/* <p className="mt-2 text-red-400">Overall Risk Level: Moderate</p> */}
          </div>

          <div className="bg-[#1e293b] rounded-2xl shadow-lg p-4">
            <h3 className="font-semilight mb-2">Tourist Demographics</h3>
            <div className="h-40 flex items-center justify-center text-gray-400">
              Pie Chart Placeholder
            </div>
            {/* <p className="mt-2 text-green-400">
              Response Time Trend: Improving
            </p> */}
          </div>
        </div>
       <button
  type="button"
  className="flex items-center justify-center w-24 h-24 text-white bg-red-600 rounded-full hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 text-xl font-bold shadow-lg">
  SOS
</button> 
      </div>
    </div>
  );
}
