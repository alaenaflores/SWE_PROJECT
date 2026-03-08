import React from 'react'
import { Link } from 'react-router-dom'
import logo from "../assets/logo.png"


const Navbar = () => {
  return (
    <nav className="bg-green-200 flex items-center gap-10 py-2 px-6 fixed top-0 left-0 w-full rounded-lg">
        <Link to="/home">
          <img src={logo} alt="Logo" className="w-20"/>
        </Link>

        <div className="flex items-center gap-5">
            <Link to="/home" className="font-semibold py-1 px-3 text-lg text-green-600 hover:text-green-900">
                Home
            </Link>

            <Link to="/achievements" className="font-semibold py-1 px-3 text-lg text-green-600 hover:text-green-900">
                Achievements
            </Link>

            <Link to="/profile" className="font-semibold py-1 px-3 text-lg text-green-600 hover:text-green-900">
                Profile
            </Link>
        </div>
    </nav>
  )
}

export default Navbar