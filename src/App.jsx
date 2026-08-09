import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* When the URL is exactly "/", show the Login page */}
        <Route path="/" element={<Login />} />

        {/* When the URL is "/register", show the Register page */}
        <Route path="/register" element={<Register />} />

        {/* After login, show the Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;