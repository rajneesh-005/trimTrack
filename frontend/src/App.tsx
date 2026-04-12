import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './Auth';
import Home from './Home';
import Dashboard from './Dashboard';
import Stats from './Stats'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path='/stats/:code' element={<Stats />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App