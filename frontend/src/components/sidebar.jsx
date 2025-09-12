import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Briefcase,
  X,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";


export default function FloatingSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  return (
    <>
      {/* Sidebar */}
      <aside
        className={` bg-[#222932] border-r border-gray-700 w-56 min-w-[180px] p-4 shadow-sm transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="md:hidden self-end text-white/60 hover:text-white transition-colors duration-200 p-1 mb-4"
          >
            <X size={20} />
          </button>

          {/* Sidebar Items */}
          <div className="flex flex-col space-y-3 flex-1">
            <button
              onClick={() => {
                navigate("/dashboard");
                onClose?.();
              }}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                currentPath === "/dashboard"
                  ? "bg-[#262d36] text-white border border-gray-600"
                  : "text-gray-300 hover:text-white hover:bg-[#262d36]"
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigate("/tourist-records");
                onClose?.();
              }}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                currentPath === "/tourist-records"
                  ? "bg-[#262d36] text-white border border-gray-600"
                  : "text-gray-300 hover:text-white hover:bg-[#262d36]"
              }`}
            >
              <Users size={20} />
              <span>Tourist Records</span>
            </button>

            <button
              onClick={() => {
                navigate("/alerts");
                onClose?.();
              }}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                currentPath === "/alerts"
                  ? "bg-[#262d36] text-white border border-gray-600"
                  : "text-gray-300 hover:text-white hover:bg-[#262d36]"
              }`}
            >
              <AlertTriangle size={20} />
              <span>Alerts</span>
            </button>

            <button
              onClick={() => {
                navigate("/cases");
                onClose?.();
              }}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded text-sm font-medium transition-colors duration-200 ${
                currentPath === "/cases"
                  ? "bg-[#262d36] text-white border border-gray-600"
                  : "text-gray-300 hover:text-white hover:bg-[#262d36]"
              }`}
            >
              <Briefcase size={20} />
              <span>FIR</span>
            </button>
          </div>

          {/* Bottom Button */}
          <div className="mt-6 mb-2">
            <button
              onClick={() => {
                navigate("/logout");
                onClose?.();
              }}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded text-white font-medium bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
