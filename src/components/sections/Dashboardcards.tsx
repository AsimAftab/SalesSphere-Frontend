import { motion } from 'framer-motion';

// This is the only component needed from this file now.
// It acts as an animated wrapper for any content (like your SVGs).
interface DashboardCardProps {
  className?: string;
  animationDelay?: number;
  floatingDuration?: number;
  rotateAmount?: number;
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  className = '',
  animationDelay = 0,
  floatingDuration = 3,
  rotateAmount = 0,
  children,
}) => {
  return (
    <motion.div
      // We remove the padding (p-5) from the wrapper
      // so the SVG (which has its own padding) fits perfectly.
      // We also make the background transparent as the SVG has its own.
      className={`bg-transparent backdrop-blur-md rounded-xl shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 30, scale: 0.9, rotateZ: 0 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: rotateAmount,
      }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0], 
        }}
        transition={{
          duration: floatingDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* The child (your <img> tag with the SVG) goes here */}
        {children}
      </motion.div>
    </motion.div>
  );
};

// All other components (CardHeader, SalesTrendCard, TeamPerformanceCard, 
// TodayOverviewCard, AttendanceCard, KeyFeaturesCard, ImageCard)
// are removed from this file.