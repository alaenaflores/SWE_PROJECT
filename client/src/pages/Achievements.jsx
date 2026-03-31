import React from 'react'
import trophyGold from "../assets/trophy-gold.png"
import AchievementCard from '../components/AchievementCard'
import starIcon from "../assets/star.png"
import flameIcon from "../assets/flame.png"
import { FaBoltLightning } from "react-icons/fa6";
import { useUser } from '../contexts/UserContext';

const Achievements = () => {
  const { user } = useUser();

  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;

  const firstStepCompleted = currentStreak > 0;
  const weekWarriorCompleted = currentStreak >= 7;

  let unlockedCount = 0;
  if (firstStepCompleted) unlockedCount += 1;
  if (weekWarriorCompleted) unlockedCount += 1;

  const totalAchievements = 7;
  const progressPercent = Math.round((unlockedCount / totalAchievements) * 100);
  return (
    <div className="px-10 min-h-screen w-full bg-gradient-to-b from-green-100 to-gray-100 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-4xl pt-35 font-bold">Achievements</h1>
          <p className="text-gray-700 text-sm mt-1 font-semibold pt-1">
            {unlockedCount} of {totalAchievements} unlocked
          </p>
        </div>
      </div>

      <div className="mb-10 flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
        <img src={trophyGold} alt="Trophy Icon" className="w-16" />
        <div className="flex flex-col">
          <p className="text-gray-500 font-semibold text-lg">Overall Progress</p>
          <h1 className="text-gray-900 font-bold text-2xl">{progressPercent}%</h1>
        </div>

      </div>


      <AchievementCard
        image={starIcon}
        header="First Step"
        text="Log your first meal"
        completed={firstStepCompleted}
      />
      <AchievementCard
        image={flameIcon}
        header="Week Warrior"
        text={`Maintain a 7-day streak (${currentStreak}/7)`}
        completed={weekWarriorCompleted}
      />

      <div className="p-6 mt-20 rounded-lg mb-6 bg-green-200 pb-10">
        <div className="flex items-center mb-3">
          <FaBoltLightning className="text-3xl mr-3 text-green-600" />
          <h1 className="text-gray-900 mr-auto font-bold text-2xl">Keep Going!</h1>
        </div>
        <p className="text-gray-500 font-semibold text-lg">
          {weekWarriorCompleted
            ? `Amazing job! You have a ${currentStreak}-day streak. Your longest streak is ${longestStreak} days.`
            : `You're currently on a ${currentStreak}-day streak. Keep logging meals consistently to unlock more achievements.`}
        </p>

      </div>

    </div>
  )
}

export default Achievements