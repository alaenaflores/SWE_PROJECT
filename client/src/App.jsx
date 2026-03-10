import "./App.css"
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from './contexts/UserContext';
import Home from "./pages/Home";
import  Login  from "./pages/Login";
import  Signup  from "./pages/Signup";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

const App = () => {
  const {user, setUser} = useUser();

  useEffect(() => {
    fetch(`http://localhost:5000/auth/me`, {credentials: "include"})
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data); 
        }
      });
  }, [setUser]);

  return (
    <>
    {/* {user && <Navbar />} */}
    <Navbar />
    <Routes>
        <Route path="/" element={<h1>Test</h1>} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
    </>
  )
}

export default App
