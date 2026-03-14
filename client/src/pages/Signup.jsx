import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
const Signup = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    fetch(`http://localhost:5050/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    })
    .then(async (response) => {
    const data = await response.json();
    console.log("Signup response:", data, "Status:", response.status);
    if (!response.ok) throw new Error(data.error || "Signup failed");
    return data;
  })
    .then((data) => {
      setUser(data);
      navigate("/");
  })
    .catch((err) => {
      console.error("Signup error:", err);
      alert("An error occurred during signup: " + err.message);
  });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-30" />
          <h1 className="text-3xl font-bold text-gray-900">Join Nutriventure</h1>
          <p className="text-gray-600 mt-2 text-center">
            Start your healthy eating journey with us today!
          </p>
        </div>

        {/* Form */}

        <form onSubmit={handleSignup} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">

          <div className="space-y-2">
            <label htmlFor="name" className="text-left block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
              required
            />
          </div>


          <div className="space-y-2">
            <label htmlFor="email" className="text-left block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-left block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-left block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-green-100 hover:bg-green-200 text-gray-900 border border-green-300 rounded font-semibold"
          >
            Create Account
          </button>
        </form>

        {/* Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-green-600 hover:text-green-700 font-semibold pb-5"
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup