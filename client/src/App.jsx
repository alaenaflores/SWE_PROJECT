import "./App.css"
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from './contexts/UserContext';
import  Login  from "./pages/Login";
import  Signup  from "./pages/Signup";

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
    <Routes>
        <Route path="/" element={<h1>Test</h1>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
