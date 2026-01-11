// src/components/sections/Features/components/FeatureTab.tsx
import React from "react";
import { motion } from "framer-motion";
import type { Feature } from "../featuresData"; 

interface FeatureTabProps {
  feature: Feature;
  isActive: boolean;
  onClick: () => void;
}

export const FeatureTab: React.FC<FeatureTabProps> = ({
  feature,
  isActive,
  onClick,
}) => {
  // Use a capital letter to tell React this is a component
  const IconComponent = feature.icon;

  return (
    <button
      onClick={onClick}
      type="button" // Accessibility: specify button type
      className={`flex flex-col items-center min-w-[120px] p-4 rounded-xl transition-all duration-300 ${
        isActive
          ? "bg-white shadow-xl ring-1 ring-gray-100"
          : "opacity-60 hover:opacity-100"
      }`}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
        style={{ backgroundColor: isActive ? `${feature.color}15` : "#f9fafb" }}
      >
        {/* Render as a component */}
        <IconComponent
          className="w-7 h-7" 
          style={{ 
            color: isActive ? feature.color : '#282f3a',
            strokeWidth: isActive ? 2.5 : 2 
          }}
        />
      </div>
      <span
        className={`text-[11px] font-extrabold uppercase tracking-widest ${
          isActive ? "text-gray-900" : "text-gray-500"
        }`}
      >
        {feature.tabLabel}
      </span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="w-1.5 h-1.5 rounded-full mt-2"
          style={{ backgroundColor: feature.color }}
        />
      )}
    </button>
  );
};
