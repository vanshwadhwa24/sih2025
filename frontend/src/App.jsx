import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "./components/sidebar";
import HomePagr from './components/HomePagr';


function App() {
  const [count, setCount] = useState(0)

  return (
    <> <div className='flex'>

        <Sidebar/>
      <HomePagr/>
    </div>
    </>
  )
}

export default App
