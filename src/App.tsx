import { Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<div className="p-8 text-center">React Router çalışıyor! ✅</div>} />
    </Routes>
  )
}

export default App
