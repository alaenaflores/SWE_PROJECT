import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom';

const PersonalInfo = () => {
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("female");
    const [activityLevel, setActivityLevel] = useState("light");
    const [goal, setGoal] = useState("maintain");

    const navigate = useNavigate();

    const handleOnboarding = (e) => {
        e.preventDefault();
        fetch(`http://localhost:5000/auth/profile`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
                body: JSON.stringify({
                height,
                weight,
                age,
                gender,
                activityLevel,
                goal
            }),
        })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok) throw new Error("Failed to save profile");
            return data;
        })
        .then(() => {
            navigate("/");
        })
        .catch((err) => {
            alert("Error saving profile: " + err.message);
        });
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center py-20">
            <div className="w-full max-w-md">

            <div className="flex flex-col items-center mb-8">
                <img src={logo} alt="Logo" className="w-30" />
                <h1 className="text-3xl font-bold text-gray-900">Tell Us About Yourself</h1>
                <p className="text-gray-600 mt-2 text-center">
                    Help us personalize your nutrition goals
                </p>
            </div>

            <form onSubmit={handleOnboarding} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-left block text-sm font-medium text-gray-700">Height (cm)</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-left block text-sm font-medium text-gray-700">Weight (lbs)</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-left block text-sm font-medium text-gray-700">Age</label>
                    <input
                        type="number"
                        placeholder="20"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-left block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                    >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-left block text-sm font-medium text-gray-700">Activity Level</label>
                    <select
                        value={activityLevel}
                        onChange={(e) => setActivityLevel(e.target.value)}
                        className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                    >
                        <option value="not">Not Active</option>
                        <option value="light">Lightly Active</option>
                        <option value="moderate">Moderately Active</option>
                        <option value="active">Very Active</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-left block text-sm font-medium text-gray-700">Goal</label>
                    <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="h-12 w-full px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900"
                    >
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain">Gain Muscle</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full h-12 bg-green-100 hover:bg-green-200 text-gray-900 border border-green-300 rounded font-semibold"
                    >
                    Submit
                </button>
            </form>
            </div>
        </div>
    )
}

export default PersonalInfo;
