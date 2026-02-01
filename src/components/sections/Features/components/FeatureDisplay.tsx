import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import type { Feature } from "../featuresData";

interface FeatureDisplayProps {
  feature: Feature;
  onNext: () => void;
  onPrev: () => void;
}

export const FeatureDisplay: React.FC<FeatureDisplayProps> = ({
  feature,
  onNext,
  onPrev,
}) => {
  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 items-center relative">
      {/* Interactive Navigation */}
      <button
        type="button"
        aria-label="Previous feature"
        onClick={onPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full border bg-white shadow-sm hover:bg-gray-50 z-10 hidden md:block"
      >
        <ChevronLeft className="w-5 h-5 text-gray-400" />
      </button>
      <button
        type="button"
        aria-label="Next feature"
        onClick={onNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full border bg-white shadow-sm hover:bg-gray-50 z-10 hidden md:block"
      >
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>

      {/* Hero Visual */}
      <div className="w-full lg:w-3/5">
        <img
          src={feature.image}
          alt={feature.title}
          width={776}
          height={408}
          className="w-full h-auto rounded-2xl transition-all duration-500 shadow-2xl"
          style={{
            // Optional: Add a subtle colored glow that matches the feature theme
            filter: `drop-shadow(0 20px 30px ${feature.color}33)`,
          }}
        />
      </div>

      {/* Content Side */}
      <div className="w-full lg:w-2/5 text-left">
        {/* Dynamic Badge Color */}
        <span
          className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 inline-block"
          style={{
            backgroundColor: `${feature.color}15`, // 15% opacity background
            color: feature.color,
          }}
        >
          {feature.badge}
        </span>

        <h4 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
          {feature.title}
        </h4>

        <p className="text-gray-500 mb-8 leading-relaxed text-sm">
          {feature.description}
        </p>

        {/* Dynamic Points List Color */}
        <ul className="space-y-4">
          {feature.points.map((point, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm font-semibold text-gray-700"
            >
              <CheckCircle2
                className="w-5 h-5"
                style={{ color: feature.color }} // Matches the icon color
              />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
