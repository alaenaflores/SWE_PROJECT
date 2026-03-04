import 'App.css'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

const App = () => {
  const {user, setUser} = useUser();

  useEffect(() => {
    fetch(`http://localhost:5173/auth/me`, {credentials: "include"})
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data); 
        }
      });
  }, [setUser]);

  return (
    <Routes>
        
    </Routes>
  )
}

export default App
