import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "./components/sidebar";
import HomePagr from './Pages/User_dashboard';
import Police_dashboard from './Pages/Police_dashboard';
import Map_dashboard from './Pages/Map_dashboard' ;

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
   
   <Routes>
  <Route path="/" element={<user_dashboard />} />
  <Route path="Police_dashboard" element={<Police_dashboard />} />
  <Route path ="Map_dashboard" element = {<Map_dashboard />} />
</Routes>
    </div>  
  )
}

export default App
