import React, { useEffect, useState } from 'react'
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { FaBoltLightning, FaTrophy } from 'react-icons/fa6';
import { BiPaperPlane } from "react-icons/bi";
import AchievementCard from '../components/AchievementCard';
import alert from "../assets/alert.png"
import notifi from "../assets/notifications.png"
import pref from "../assets/preferences.png"
import { IoMdExit } from "react-icons/io";



const Profile = () => {

  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    currentStreak: 0,
    longestStreak: 0
  });
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        credentials: "include"
      });

      console.log("profile status:", res.status);

      const data = await res.json();
      console.log("profile data:", data);

      if (res.ok) {
        setUser(data);
      } else {
        console.error("Profile fetch failed:", data);
      }
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  fetchProfile();
}, []);
  return (
    <div className="px-10 min-h-screen w-full bg-gradient-to-b from-green-100 to-gray-100 pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900 text-4xl pt-35 font-bold">Profile</h1>
          </div>
        </div>

        <div className="flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
            <CgProfile className="text-5xl text-green-500" />
            <div className="flex flex-col">   
                <p className="text-gray-900 font-bold text-2xl">{user.name}</p>
                <h1 className="text-gray-500 font-semibold text-base">{user.email}</h1>
            </div>
        </div>

        <div className="flex gap-4 w-full mt-6 mb-8">
          <div className="flex flex-col gap-2 rounded-lg bg-orange-500 p-4 w-1/2">
            <div className="flex items-center gap-2 text-white">
              <FaBoltLightning className="text-sm" />
              <p className="text-sm font-medium">Current Streak</p>
            </div>
            <h1 className="text-white font-bold text-2xl">{user.currentStreak}</h1>
          </div>

          <div className="flex flex-col gap-2 rounded-lg bg-green-500 p-4 w-1/2">
            <div className="flex items-center gap-2 text-white">
              <FaTrophy className="text-sm" />
              <p className="text-sm font-medium">Longest Streak</p>
            </div>
            <h1 className="text-white font-bold text-2xl">{user.longestStreak}</h1>
          </div>
        </div>
      <div onClick={() => navigate("/notifications")} className="cursor-pointer"> 
        <AchievementCard 
        image={notifi} 
        header="Notifications" 
        text="Meal reminders & achievements" 
        completed={null} 
        />
      </div>
        <div className="p-6 mt-10 rounded-lg bg-green-200 pb-8">
          <div className="flex items-center mb-3">
            <BiPaperPlane className="text-3xl mr-3 text-green-700" />
              <h1 className="text-gray-900 mr-auto font-bold text-2xl">About Nutriventure</h1>
            </div>
            <p className="text-gray-500 font-semibold text-lg">Nutriventure helps college students build healthy eating habits through daily streaks, achievements, and constant motivation. Keep logging your meals to unlock new achievements and maintain your streak!</p>
        </div>

        <button
            onClick={() => navigate("/login")}
            className="mt-5 pt-5 pb-5 w-full border-2 border-red-300 rounded text-red-500 font-bold hover:!bg-[#fee2e2] transition-colors duration-300"
        >
              <IoMdExit className="inline-block mr-2 text-xl" />
          Log Out
        </button>


    </div>
  )
}

export default Profile