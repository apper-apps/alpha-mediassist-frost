import React from "react";
import { cn } from "@/utils/cn";

const SeveritySlider = ({ 
  value = 0, 
  onChange, 
  symptomName,
  className 
}) => {
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1: return "text-green-600";
      case 2: return "text-yellow-600";
      case 3: return "text-orange-600";
      case 4: return "text-red-600";
      case 5: return "text-red-800";
      default: return "text-surface-500";
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 1: return "Mild";
      case 2: return "Moderate";
      case 3: return "Significant";
      case 4: return "Severe";
      case 5: return "Critical";
      default: return "None";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-surface-700">{symptomName}</span>
        <span className={cn("text-sm font-semibold", getSeverityColor(value))}>
          {value}/5 - {getSeverityLabel(value)}
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        value={value}
        onChange={handleChange}
        className={cn(
          "severity-slider w-full",
          value === 1 && "severity-1",
          value === 2 && "severity-2",
          value === 3 && "severity-3",
          value === 4 && "severity-4",
          value === 5 && "severity-5"
        )}
      />
      <div className="flex justify-between text-xs text-surface-500 px-1">
        <span>None</span>
        <span>Mild</span>
        <span>Moderate</span>
        <span>Significant</span>
        <span>Severe</span>
        <span>Critical</span>
      </div>
    </div>
  );
};

export default SeveritySlider;