import { Link } from 'react-router-dom'
import flame from "../assets/flame.png"
import trophy from "../assets/trophy.png"
import { useUser } from '../contexts/UserContext';
import React, { useEffect, useState } from 'react'

const Home = () => {
  const { user } = useUser();
  const [mealType, setMealType] = useState("breakfast");
  const [items, setItems] = useState("");
  const [meals, setMeals] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (user?.currentStreak !== undefined) {
      setCurrentStreak(user.currentStreak);
    }
  }, [user]);

  const addMeal = async () => {
    try {
      const res = await fetch("http://localhost:5050/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          date: new Date().toISOString(),
          mealType,
          items: items
            .split(",")
            .map(i => i.trim())
            .filter(i => i !== "")
            .map(i => ({
              name: i
            }))
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        return;
      }

      setMeals(prev => [data.meal, ...prev]);
      setCurrentStreak(data.currentStreak);
      setItems("");

    } catch (err) {
      console.log("Error adding meal:", err);
    }
  };

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("http://localhost:5000/meals", {
          credentials: "include"
        });

        const data = await res.json();

        if (res.ok) {
          setMeals(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMeals();
  }, []);

  return (
    <div className="px-10 min-h-screen w-full bg-gradient-to-b from-green-100 to-gray-100 pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-gray-900 text-4xl pt-35 font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-gray-700 text-sm mt-1 font-semibold pt-1">Let's make today count</p>
        </div>
      </div>

      <div className="flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
        <img src={flame} alt="Flame Icon" className="w-16" />
        <div className="flex flex-col">
          <p className="text-gray-500 font-semibold text-lg">Current Streak</p>
          <h1 className="text-gray-900 font-bold text-2xl">
            {currentStreak} {currentStreak === 1 ? "day" : "days"}
          </h1>
        </div>

        <Link to="/achievements" className="ml-auto">
          <img src={trophy} alt="Trophy Icon" className="w-16" />
        </Link>
      </div>


      <div className="mt-10 flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
        <h1 className="text-gray-900 pb-30 font-bold text-xl">Daily Goals</h1>
      </div>

      <div className="mt-10 rounded-lg w-full bg-white p-6 shadow-lg text-gray-900">
        <h1 className="text-gray-900 pb-5 font-bold text-xl">Today's Meals</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="border p-2 w-full mb-2"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>

          <input
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder="Enter foods (separated by commas)"
            className="border p-2 w-full mb-2"
          />

          <button
            onClick={() => addMeal()}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Meal
          </button>

          <div className="mt-4">
            {meals.map((meal, i) => (
              <div key={i} className="border-b py-2">
                <p className="font-semibold">{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</p>
                <p className="text-sm text-gray-600">
                  {meal.items.map(item => item.name).join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
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