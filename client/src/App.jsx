import "./App.css"
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from './contexts/UserContext';

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
    </Routes>
  )
}

export default App
