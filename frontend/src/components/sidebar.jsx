import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Briefcase,
  X,
  LogOut,
} from "lucide-react";
import { useLocation } from "react-router-dom";

// For demonstration - replace with your actual navigation logic
const navigateTo = (path) => {
  console.log(`Navigating to: ${path}`);
  // Replace with your router navigation
  // For Next.js: router.push(path)
  // For React Router: navigate(path)
};

export default function FloatingSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-4 z-40 transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-2xl w-48`}
        style={{
          top: "calc(4rem + 1rem + 32px)", // navbar height + navbar top margin + larger gap
          bottom: "16px", // bottom margin to match navbar side margins
        }}
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
                navigateTo("/dashboard");
                onClose?.();
              }}
              className={`flex items-center space-x-3 w-full transition-all duration-200 p-3 rounded-xl hover:scale-105 ${
                currentPath === "/dashboard"
                  ? "text-white bg-white/20 border border-white/30 scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="text-sm font-medium">Dashboard</span>
            </button>

            <button
              onClick={() => {
                navigateTo("/tourist-records");
                onClose?.();
              }}
              className={`flex items-center space-x-3 w-full transition-all duration-200 p-3 rounded-xl hover:scale-105 ${
                currentPath === "/tourist-records"
                  ? "text-white bg-white/20 border border-white/30 scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Users size={20} />
              <span className="text-sm font-medium">Tourist Records</span>
            </button>

            <button
              onClick={() => {
                navigateTo("/alerts");
                onClose?.();
              }}
              className={`flex items-center space-x-3 w-full transition-all duration-200 p-3 rounded-xl hover:scale-105 ${
                currentPath === "/alerts"
                  ? "text-white bg-white/20 border border-white/30 scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <AlertTriangle size={20} />
              <span className="text-sm font-medium">Alerts</span>
            </button>

            <button
              onClick={() => {
                navigateTo("/cases");
                onClose?.();
              }}
              className={`flex items-center space-x-3 w-full transition-all duration-200 p-3 rounded-xl hover:scale-105 ${
                currentPath === "/cases"
                  ? "text-white bg-white/20 border border-white/30 scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Briefcase size={20} />
              <span className="text-sm font-medium">Cases</span>
            </button>
          </div>

          {/* Bottom Button */}
          <div className="mt-6 mb-2">
            <button
              onClick={() => {
                navigateTo("/logout");
                onClose?.();
              }}
              className="flex items-center justify-center space-x-2 w-full transition-all duration-200 p-3 rounded-xl hover:scale-105 text-white font-medium"
              style={{ backgroundColor: "#338cd8" }}
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
