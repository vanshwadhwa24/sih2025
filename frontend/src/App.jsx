import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FloatingSidebar from './components/Sidebar';
import FloatingNavbar from './components/Navbar';
import Police_dashboard from "./Pages/Dashboard";
import Map_dashboard from "./Pages/Map";
import FIR from "./Pages/FIR";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={</>} /> */}
        <Route path="/" element={<Police_dashboard />} />
        <Route path="/map" element={<Map_dashboard />} />
        <Route path="/cases" element={<FIR />} />
      </Routes>
    </div>
  );
}

export default App;
