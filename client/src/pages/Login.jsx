import React, { useState } from 'react'
import logo from "../assets/logo.png"


const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }), 
    })
      .then((response) => response.json())
      .then((data) => {   
        if (data.id) {
          setUser(data);
          navigate("/");
        } else {
          alert("Login failed: " + (data.message || "Unknown error"));
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again.");
      });
  };

  return (
    <body className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
    
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="w-30" />
          <h1 className="text-3xl font-bold text-gray-900">Nutriventure</h1>
          <p className="text-gray-600 mt-2 text-center">
            Your journey to healthier eating starts here
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-left block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="your.email@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full"
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
              className="h-12 w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-green-100 hover:bg-green-200 text-gray-900 border border-green-300 rounded font-semibold"
          >
            Log In
          </button>

          <div className="text-center">
            <button
              type="button"
              className="text-green-600 hover:text-green-700 text-sm"
            >
              Forgot password?
            </button>
          </div>
        </form>

        {/* Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-green-600 hover:text-green-700  font-semibold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </body>
  )
}

export default Login