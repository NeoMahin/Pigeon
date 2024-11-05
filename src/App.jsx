import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Auth/Login';
import SignUp from './Pages/Auth/signUp'; // Ensure SignUp is capitalized
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}
