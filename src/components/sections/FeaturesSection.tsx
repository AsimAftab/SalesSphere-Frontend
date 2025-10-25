import React from 'react';
import type { ReactNode } from 'react';
import underlineStroke from '../../assets/Image/stroke.svg'; 
import { MapPinIcon, ShoppingCartIcon, ShieldCheckIcon, ChartBarIcon, UsersIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

// --- Utility function for merging classes (similar to clsx or classnames) ---
const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// --- FeatureCard Component (Integrated) ---

type FeatureVariant = "default" | "highlighted" | "gradient";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: FeatureVariant;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  variant = "default",
}) => {
  // Define custom colors.
  const CARD_BG = "bg-white"; // Main card background is white
  const ICON_BG_DEFAULT = "bg-[#197ADC]"; // Bright blue icon background remains the same
  const TEXT_COLOR_TITLE_LIGHT = "text-gray-900"; // Darker title text color for light card
  const TEXT_COLOR_DESCRIPTION_LIGHT = "text-gray-700"; // Darker description text color for light card

  const getBackgroundClass = (): string => {
    switch (variant) {
      case "highlighted":
      case "gradient": 
        return "bg-gradient-to-b from-[#163355] to-[#1E4976]"; 
      case "default":
      default:
        return CARD_BG; 
    }
  };

  const getIconBackgroundClass = (): string => {
    switch (variant) {
      case "gradient":
        // Original bright blue gradient for icon background
        return "bg-gradient-to-b from-[#197ADC] to-[#4DA3E8]";
      default:
        return ICON_BG_DEFAULT;
    }
  };

  const getIconGlowClass = (): string => {
    switch (variant) {
      case "gradient":
        // Original bright blue gradient glow effect
        return "bg-gradient-to-b from-[#197ADC] to-[#4DA3E8] opacity-30 blur-2xl";
      case "highlighted":
        // Original dark glow for highlighted card background
        return "bg-[#163355] opacity-30 blur-2xl"; 
      case "default":
      default:
        // Adjusted for the default card on white background, still providing a blue glow
        return "bg-gradient-to-b from-[#197ADC] to-blue-300 opacity-30 blur-2xl";
    }
  };
    
  // Check if the card has a dark background (highlighted or gradient)
  const isDarkBackground = variant === "highlighted" || variant === "gradient";

  return (
    <div
      className={cn(
        "group relative w-full h-full rounded-[14px] border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2", 
        isDarkBackground ? "shadow-lg shadow-blue-900/50 hover:shadow-blue-500/50" : "shadow-md hover:shadow-lg", 
        getBackgroundClass()
      )}
    >
      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Icon Container with Glow */}
        <div className="relative mb-8">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-white",
              getIconBackgroundClass()
            )}
          >
            {icon}
          </div>
          {/* Glow Element */}
          <div className={cn("absolute top-0 left-0 w-16 h-16 rounded-2xl", getIconGlowClass())} />
        </div>

        {/* Title - Text color adjusts based on card background (dark card gets white text) */}
        <h3 className={cn("text-2xl font-bold leading-8 mb-6", isDarkBackground ? "text-white" : TEXT_COLOR_TITLE_LIGHT)}>
          {title}
        </h3>

        {/* Description - Text color adjusts based on card background */}
        <p className={cn("text-lg font-normal leading-[26px]", isDarkBackground ? "text-white" : TEXT_COLOR_DESCRIPTION_LIGHT)}>
          {description}
        </p>
      </div>
    </div>
  );
};


// --- FeaturesSection Component ---

const features: (FeatureCardProps & { variant: FeatureVariant })[] = [
  { icon: <MapPinIcon className="h-8 w-8 text-white" />, title: 'GPS Tracking', description: 'Real-time location tracking for sales personnel with automated check-in/check-out and route mapping.', variant: "highlighted" }, 
  { icon: <ShoppingCartIcon className="h-8 w-8 text-white" />, title: 'Order Management', description: 'Empower your sales team to create orders, browse the product catalogue, and manage pricing on the go.', variant: "highlighted" }, 
  { icon: <ShieldCheckIcon className="h-8 w-8 text-white" />, title: 'Smart Attendance', description: 'Automated check-in/check-out system with GPS verification and attendance reports.', variant: "highlighted" },  
  { icon: <ChartBarIcon className="h-8 w-8 text-white" />, title: 'Analytics Dashboard', description: 'Comprehensive insights into sales performance, territory visibility, and revenue trends.', variant: "highlighted" }, 
  { icon: <UsersIcon className="h-8 w-8 text-white" />, title: 'Role-Based Access', description: 'Secure access control for Admin, Managers, Sales Account, and Soap roles.', variant: "highlighted" }, 
  { icon: <ArchiveBoxIcon className="h-8 w-8 text-white" />, title: 'Stock Management', description: 'Efficiently track inventory levels and manage stock reconciliation with real-time stock updates.', variant: "highlighted" },
];

const FeaturesSection: React.FC = () => {
  return (
    // Main section 
    <div  id="features" className="bg-gray-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header Section  */}
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Features</h1>
          <div className="mt-2 mb-4">
            <img 
              src={underlineStroke} 
              alt="Underline Stroke" 
              className="w-48 h-auto mx-auto" 
              aria-hidden="true" 
            />
          </div>
          <p className="mt-4 text-lg leading-8 text-black">
            Beyond Management: A unified platform engineered to revolutionize field sales performance, delivering the intelligence and automation needed to convert opportunities into revenue faster than ever.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.title} className="min-h-[327px]">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variant={feature.variant}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;