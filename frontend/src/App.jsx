import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import FloatingSidebar from './components/Sidebar';
import FloatingNavbar from './components/Navbar';
import Police_dashboard from "./Pages/Dashboard";
import Map_dashboard from "./Pages/Map";
import FIR from "./Pages/FIR";
import Record from "./Pages/Record";
import Alert from "./Pages/Alert";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  return (
    <div>
      <Routes>
        {/* <Route path="/" element={</>} /> */}
        <Route path="/" element={<Police_dashboard />} />
        <Route path="/dashboard" element={<Police_dashboard />} />
        <Route path="/map" element={<Map_dashboard />} />
        <Route path="/cases" element={<FIR />} />
        <Route path="/tourist-records" element={<Record/>} />
        <Route path="/alerts" element={<Alert />} />
      </Routes>
    </div>
  );
}

export default App;
