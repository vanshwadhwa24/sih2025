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
    <nav
      className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/40 backdrop-blur-md"
          : "bg-black/30 backdrop-blur-md"
      } rounded-2xl border border-white/10 shadow-2xl`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="text-white font-bold text-xl cursor-pointer"
            onClick={() => navigateTo("/")}
          >
            Logo
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigateTo("/")}
              className={`transition-colors duration-200 px-4 py-2 rounded-lg ${
                currentPath === "/"
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo("/about")}
              className={`transition-colors duration-200 px-4 py-2 rounded-lg ${
                currentPath === "/about"
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              About
            </button>
            <button
              onClick={() => navigateTo("/services")}
              className={`transition-colors duration-200 px-4 py-2 rounded-lg ${
                currentPath === "/services"
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => navigateTo("/contact")}
              className={`transition-colors duration-200 px-4 py-2 rounded-lg ${
                currentPath === "/contact"
                  ? "text-white bg-white/20 border border-white/30"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button className="text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10">
              <Search size={20} />
            </button>
            <button className="text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10">
              <Bell size={20} />
            </button>
            <button
              onClick={onMenuClick}
              className="md:hidden text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
