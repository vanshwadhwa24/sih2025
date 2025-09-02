import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "./components/sidebar";
import HomePagr from './Pages/User_dashboard';
import Police_dashboard from './Pages/Police_dashboard';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>

    <Sidebar/>
   <Routes>
  <Route path="/" element={<Police_dashboard />} />
</Routes>

    </div>
  
  )
}

export default App
