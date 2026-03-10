import React from 'react'
import { Link } from 'react-router-dom'
import flame from "../assets/flame.png"
import trophy from "../assets/trophy.png"
const Home = () => {
  return (
    <div className="px-10 min-h-screen w-full bg-gradient-to-b from-green-100 to-gray-100 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900 text-4xl pt-35 font-bold">Welcome back, User!</h1>
            <p className="text-gray-700 text-sm mt-1 font-semibold pt-1">Let's make today count</p>
          </div>
        </div>

        <div className="flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
            <img src={flame} alt="Flame Icon" className="w-16" />
            <div className="flex flex-col">   
                <p className="text-gray-500 font-semibold text-lg">Current Streak</p>
                <h1 className="text-gray-900 font-bold text-2xl">X days</h1>
            </div>
            
            <Link to="/achievements" className="ml-auto">
              <img src={trophy} alt="Trophy Icon" className="w-16" />
            </Link>
        </div>


        <div className="mt-10 flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
             <h1 className="text-gray-900 pb-30 font-bold text-xl">Daily Goals</h1>
        </div>

        <div className="mt-10 flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
             <h1 className="text-gray-900 pb-30 font-bold text-xl">Today's Meals</h1>
        </div>

        <div className="mt-10 flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
             <h1 className="text-gray-900 pb-30 font-bold text-xl">Today's Progress</h1>
        </div>

        <div className="mt-10 flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
             <h1 className="text-gray-900 pb-30 font-bold text-xl">This Week's Stats</h1>
        </div>
    </div>
  )
}

export default Home