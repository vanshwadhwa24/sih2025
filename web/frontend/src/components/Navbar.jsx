import { useState, useEffect } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

// For demonstration - replace with your actual navigation logic
const navigateTo = (path) => {
  console.log(`Navigating to: ${path}`);
  // Replace with your router navigation
  // For Next.js: router.push(path)
  // For React Router: navigate(path)
};

export default function FullScreenNavbar({ onMenuClick }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="w-full bg-[#222932] border-b border-gray-700 shadow-sm">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="text-white font-bold text-xl cursor-pointer" onClick={() => navigateTo("/")}>Logo</div>
        {/* <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => navigateTo("/")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              currentPath === "/"
                ? "bg-[#262d36] text-white border border-gray-600"
                : "text-gray-300 hover:text-white hover:bg-[#262d36]"
            }`}
          >Home</button>
          <button
            onClick={() => navigateTo("/about")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              currentPath === "/about"
                ? "bg-[#262d36] text-white border border-gray-600"
                : "text-gray-300 hover:text-white hover:bg-[#262d36]"
            }`}
          >About</button>
          <button
            onClick={() => navigateTo("/services")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              currentPath === "/services"
                ? "bg-[#262d36] text-white border border-gray-600"
                : "text-gray-300 hover:text-white hover:bg-[#262d36]"
            }`}
          >Services</button>
          <button
            onClick={() => navigateTo("/contact")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
              currentPath === "/contact"
                ? "bg-[#262d36] text-white border border-gray-600"
                : "text-gray-300 hover:text-white hover:bg-[#262d36]"
            }`}
          >Contact</button>
        </div> */}
        <div className="flex items-center space-x-2">
          <button className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded hover:bg-[#262d36]">
            <Search size={20} />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded hover:bg-[#262d36]">
            <Bell size={20} />
          </button>
          <button
            onClick={onMenuClick}
            className="md:hidden text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded hover:bg-[#262d36]"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
