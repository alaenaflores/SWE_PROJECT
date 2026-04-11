import { Link } from 'react-router-dom'
import flame from "../assets/flame.png"
import trophy from "../assets/trophy.png"
import { useUser } from '../contexts/UserContext';
import React, { useEffect, useState, useRef } from 'react'

const scaleNutrients = (food, quantity) => {
  const gramsPerServing = food.servingSize || 100;
  const scale = (quantity * gramsPerServing) / 100;
  return {
    calories: Math.round((food.nutrients.calories || 0) * scale),
    protein:  Math.round((food.nutrients.protein  || 0) * scale),
    carbs:    Math.round((food.nutrients.carbs    || 0) * scale),
    fat:      Math.round((food.nutrients.fat      || 0) * scale),
    fiber:    Math.round((food.nutrients.fiber    || 0) * scale),
  };
};

const calcDailyTotals = (meals) =>
  meals.reduce((totals, meal) => {
    meal.items.forEach(item => {
      totals.calories += item.calories || 0;
      totals.protein  += item.protein  || 0;
      totals.carbs    += item.carbs    || 0;
      totals.fat      += item.fat      || 0;
    });
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

const MacroBar = ({ label, value, goal, color }) => {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value}g / {goal}g</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useUser();
  const [mealType, setMealType] = useState("breakfast");
  const [meals, setMeals] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const goals = {
    calories: user?.goals?.calories || 2000,
    protein:  user?.goals?.protein  || 150,
    carbs:    user?.goals?.carbs    || 250,
    fat:      user?.goals?.fat      || 65,
  };

  // Edit Meal function
  const handleEditMeal = async (mealId) => {
    const updatedMealType = prompt("Enter new meal type", "Breakfast");
    const updatedItems = prompt("Enter updated items", "Eggs, Toast");

    const res = await fetch(`http://localhost:5000/meals/${mealId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        mealType: updatedMealType,
        items: updatedItems.split(",").map((item) => ({ name: item.trim() })),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMeals((prevMeals) => prevMeals.map((meal) =>
        meal._id === mealId ? { ...meal, ...data } : meal
      ));
    } else {
      console.error(data.error);
    }
  };

  // Delete Meal function
  const handleDeleteMeal = async (mealId) => {
    const res = await fetch(`http://localhost:5000/meals/${mealId}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json();
    if (res.ok) {
      setMeals((prevMeals) => prevMeals.filter((meal) => meal._id !== mealId));
    } else {
      console.error(data.error);
    }
  };

  useEffect(() => {
    if (user?.currentStreak !== undefined) {
      setCurrentStreak(user.currentStreak);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchFood = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `http://localhost:5000/food/search?query=${encodeURIComponent(searchQuery)}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setSearchResults(data);
      setShowDropdown(true);
    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const selectFood = (food) => {
    setSelectedItems(prev => [...prev, { ...food, quantity: 1 }]);
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const updateQuantity = (index, quantity) => {
    setSelectedItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity: Math.max(0.25, parseFloat(quantity) || 0.25) } : item
    ));
  };

  const removeItem = (index) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const addMeal = async () => {
    if (selectedItems.length === 0) return;
    try {
      const res = await fetch("http://localhost:5000/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          date: new Date().toISOString(),
          mealType,
          items: selectedItems.map(item => {
            const scaled = scaleNutrients(item, item.quantity);
            return {
              name:        item.name,
              fdcId:       item.fdcId,
              quantity:    item.quantity,
              servingSize: item.servingSize,
              ...scaled,
            };
          }),
        })
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.error);
        return;
      }

      setMeals(prev => [data.meal, ...prev]);
      setCurrentStreak(data.currentStreak);
      setSelectedItems([]);

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

  const dailyTotals = calcDailyTotals(meals);

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

      <div className="mt-10 rounded-lg w-full bg-white p-6 shadow-lg">
        <h1 className="text-gray-900 font-bold text-xl mb-4">Daily Goals</h1>
        <div className="flex items-center justify-between mb-5 bg-green-50 rounded-lg p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{dailyTotals.calories}</p>
            <p className="text-xs text-gray-500">eaten</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{goals.calories}</p>
            <p className="text-xs text-gray-500">goal</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-500">
              {Math.max(0, goals.calories - dailyTotals.calories)}
            </p>
            <p className="text-xs text-gray-500">remaining</p>
          </div>
        </div>
        <MacroBar label="Protein"       value={dailyTotals.protein} goal={goals.protein} color="bg-blue-400" />
        <MacroBar label="Carbohydrates" value={dailyTotals.carbs}   goal={goals.carbs}   color="bg-yellow-400" />
        <MacroBar label="Fat"           value={dailyTotals.fat}     goal={goals.fat}     color="bg-red-400" />
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

          <div className="relative mb-4" ref={dropdownRef}>
            <div className="flex gap-2">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchFood()}
                placeholder="Search for a food (e.g. chicken breast)..."
                className="border p-2 flex-1 rounded"
              />
              <button
                onClick={searchFood}
                disabled={isSearching}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-xl mt-1 max-h-56 overflow-y-auto">
                {searchResults.map(food => (
                  <li
                    key={food.fdcId}
                    onClick={() => selectFood(food)}
                    className="p-3 hover:bg-green-50 cursor-pointer border-b last:border-0"
                  >
                    <p className="font-medium text-sm text-gray-800">{food.name}</p>
                    <p className="text-xs text-gray-400">
                      {food.nutrients.calories} cal · {food.nutrients.protein}g protein · per {food.servingSize}{food.servingSizeUnit}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedItems.length > 0 && (
            <div className="mb-4 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Selected Foods
              </div>
              {selectedItems.map((item, i) => {
                const scaled = scaleNutrients(item, item.quantity);
                return (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0 bg-white">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {scaled.calories} cal · {scaled.protein}g protein · {scaled.carbs}g carbs · {scaled.fat}g fat
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(i, e.target.value)}
                        className="border p-1 w-16 text-center rounded text-sm"
                      />
                      <span className="text-xs text-gray-400">srv</span>
                    </div>
                    <button
                      onClick={() => removeItem(i)}
                      className="text-red-400 hover:text-red-600 text-lg leading-none shrink-0"
                    >✕</button>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={() => addMeal()}
            disabled={selectedItems.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add Meal
          </button>

          <div className="mt-4">
            {meals.map((meal) => {
              const mealTotal = meal.items.reduce((t, item) => ({
                calories: t.calories + (item.calories || 0),
                protein:  t.protein  + (item.protein  || 0),
              }), { calories: 0, protein: 0 });

              return (
                <div key={meal._id} className="border-b py-2">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}</p>
                    <p className="text-sm text-gray-500">{mealTotal.calories} cal · {mealTotal.protein}g protein</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    {meal.items.map(item => item.name).join(", ")}
                  </p>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditMeal(meal._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2 mt-2"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteMeal(meal._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-lg w-full bg-white p-6 shadow-lg">
        <h1 className="text-gray-900 font-bold text-xl mb-4">Today's Progress</h1>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { label: "Calories", value: dailyTotals.calories, unit: "kcal", color: "text-green-500" },
            { label: "Protein",  value: dailyTotals.protein,  unit: "g",    color: "text-blue-500"  },
            { label: "Carbs",    value: dailyTotals.carbs,    unit: "g",    color: "text-yellow-500"},
            { label: "Fat",      value: dailyTotals.fat,      unit: "g",    color: "text-red-500"   },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-4">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-gray-400">{unit}</p>
              <p className="text-sm text-gray-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex items-center gap-6 rounded-lg w-full bg-white p-6 shadow-lg">
        <h1 className="text-gray-900 pb-30 font-bold text-xl">This Week's Stats</h1>
      </div>
    </div>
  )
}

export default Home