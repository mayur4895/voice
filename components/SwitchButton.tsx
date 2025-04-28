"use client";

import { useState } from "react";

export default function SwitchButton({
  setIsGradient,
}: {
  setIsGradient: (value: boolean) => void;
}) {
  const [isSwitchedOn, setIsSwitchedOn] = useState(false);  

  const handleSwitch = () => {
    setIsSwitchedOn((prev) => !prev);
    setIsGradient(!isSwitchedOn); 
  };

  return (
     
      
      <div className="flex items-center">
        <label className="mr-2 text-slate-700">SWitch</label>
        <button
          onClick={handleSwitch}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
            isSwitchedOn ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
              isSwitchedOn ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button> 
        </div>
    
  );
}
