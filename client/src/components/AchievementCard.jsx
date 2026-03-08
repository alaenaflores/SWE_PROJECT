import React from 'react'

const AchievementCard = ({image, header, text, completed}) => {
  return (
    <div className="flex items-center justify-between rounded-lg w-full bg-white p-4 shadow-md border border-gray-100 mb-4">
      <div className="flex items-center gap-4">
        <img src={image} alt={header} className="w-auto h-12" />
        <div className="flex flex-col">
          <h2 className="text-gray-900 font-semibold text-base">{header}</h2>
          <p className="text-gray-500 text-sm">{text}</p>
        </div>
      </div>

      <span className={`text-sm px-3 py-1 rounded-full font-medium ${
        completed 
          ? "bg-green-100 text-green-600" 
          : "bg-teal-100 text-teal-500"
      }`}>
        {completed ? "Completed" : "Unlocked"}
      </span>
    </div>
  )
}

export default AchievementCard