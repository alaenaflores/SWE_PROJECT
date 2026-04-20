import React, { useEffect, useState } from 'react'
import trophyGold from "../assets/trophy-gold.png"
import AchievementCard from '../components/AchievementCard'
import starIcon from "../assets/star.png"
import flameIcon from "../assets/flame.png"
import { FaBoltLightning } from "react-icons/fa6";
import { useUser } from '../contexts/UserContext';

const calcDailyTotals = (meals) =>
  meals.reduce((totals, meal) => {
    meal.items.forEach(item => {
      totals.calories += item.calories || 0;
      totals.protein += item.protein || 0;
      totals.carbs += item.carbs || 0;
      totals.fat += item.fat || 0;
    });
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

const Achievements = () => {
  const { user } = useUser();
  const [meals, setMeals] = useState([]);

  const currentStreak = user?.currentStreak || 0;
  const longestStreak = user?.longestStreak || 0;

  const goals = {
    calories: user?.nutritionGoals?.calories || 2000,
    protein: user?.nutritionGoals?.protein_g || 150,
    carbs: user?.nutritionGoals?.carbs_g || 250,
    fat: user?.nutritionGoals?.fats_g || 65,
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("http://localhost:5000/meals", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          const today = new Date().toDateString();
          const todaysMeals = data.filter(meal =>
            new Date(meal.date).toDateString() === today
          );
          setMeals(todaysMeals);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (user) fetchMeals();
  }, [user?._id]);

  const dailyTotals = calcDailyTotals(meals);

  const firstStepCompleted   = currentStreak > 0;
  const weekWarriorCompleted = currentStreak >= 7;

  const calorieGoalHit = dailyTotals.calories >= goals.calories;
  const proteinGoalHit = dailyTotals.protein >= goals.protein;
  const carbsGoalHit = dailyTotals.carbs >= goals.carbs;
  const fatGoalHit = dailyTotals.fat >= goals.fat;
  const macroMasterCompleted = proteinGoalHit && carbsGoalHit && fatGoalHit;

  let unlockedCount = 0;
  if (firstStepCompleted) unlockedCount += 1;
  if (weekWarriorCompleted) unlockedCount += 1;
  if (calorieGoalHit) unlockedCount += 1;
  if (proteinGoalHit) unlockedCount += 1;
  if (carbsGoalHit) unlockedCount += 1;
  if (fatGoalHit) unlockedCount += 1;
  if (macroMasterCompleted) unlockedCount += 1;

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

      <AchievementCard
        image={starIcon}
        header="Calorie Crusher"
        text={`Hit your daily calorie goal (${dailyTotals.calories}/${goals.calories} kcal)`}
        completed={calorieGoalHit}
      />

      <AchievementCard
        image={flameIcon}
        header="Protein Pro"
        text={`Hit your daily protein goal (${dailyTotals.protein}/${goals.protein}g)`}
        completed={proteinGoalHit}
      />

      <AchievementCard
        image={starIcon}
        header="Carb Champion"
        text={`Hit your daily carb goal (${dailyTotals.carbs}/${goals.carbs}g)`}
        completed={carbsGoalHit}
      />

      <AchievementCard
        image={flameIcon}
        header="Fat Fueled"
        text={`Hit your daily fat goal (${dailyTotals.fat}/${goals.fat}g)`}
        completed={fatGoalHit}
      />

      <AchievementCard
        image={trophyGold}
        header="Triple Threat"
        text="Hit all three macro goals in a single day"
        completed={macroMasterCompleted}
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
  );
};

export default Achievements;
