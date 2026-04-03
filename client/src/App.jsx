import "./App.css"
import { Routes, Route, Navigate, useLocation} from 'react-router-dom'
import { useEffect } from 'react'
import { useUser } from './contexts/UserContext';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";
import PersonalInfo from "./pages/PersonalInfo"
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Notifications from "./pages/Notifications";


const App = () => {
  const { user, setUser } = useUser();

  useEffect(() => {
    fetch(`http://localhost:5000/auth/me`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data);
        }
      });
  }, [setUser]);

  const location = useLocation();
  const showNavbar = !['/login', '/signup', '/personalInfo'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/personalInfo"
          element={
            <ProtectedRoute>
              <PersonalInfo />
            </ProtectedRoute>
          }
        />
        <Route path="/notifications" 
        element=
        {<Notifications />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Achievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

export default App
