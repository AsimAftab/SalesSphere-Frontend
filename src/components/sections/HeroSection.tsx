import { motion } from 'framer-motion';
import underlineStroke from '../../assets/Image/stroke.svg';
// We only need the DashboardCard wrapper
import {
  DashboardCard,
} from './Dashboardcards';

// --- IMPORT YOUR NEW SVGs ---

import MainDashboardSVG from '../../assets/Image/hero_section_images/Container.svg';      // The large central card
import SalesTrendSVG from '../../assets/Image/hero_section_images/Container(2).svg';     // Top Left
import TeamPerformanceSVG from '../../assets/Image/hero_section_images/Container(1).svg'; // Top Right
import TodayOverviewSVG from '../../assets/Image/hero_section_images/Container(4).svg'; // Bottom Left
import AttendanceSVG from '../../assets/Image/hero_section_images/Container(3).svg';      // Bottom Right
// Note: Container(5) and Container(6) are not used in this layout for brevity

const HeroSection = () => {
  return (
    <div className="relative bg-primary overflow-hidden min-h-screen flex items-center">
      {/* Gradient overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#163355] via-[#1a3a5f] to-[#163355]" />
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#197ADC]/5 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#197ADC]/10 blur-3xl rounded-full" />

      {/* Main content container */}
      <div className="relative z-10 w-full py-12">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative lg:grid lg:grid-cols-2 lg:gap-12">
            
            {/* Left Column - Text Content (Unchanged) */}
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:text-left flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                  <span className="block text-[#197ADC]">One Platform</span>
                  <span className="block">Infinite Sales</span>
                  <span className="block">Possibilities</span>
                </h1>
                <motion.div
                  className="mt-6"
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <img
                    src={underlineStroke}
                    alt="Underline"
                    className="w-64 h-auto mx-auto lg:mx-0"
                    aria-hidden="true"
                  />
                </motion.div>
                <p className="mt-6 text-base text-gray-300 max-w-xl">
                  Transform your sales operations with our AI-powered platform.
                  Automate workflows, track performance, and drive growth with real-time insights.
                </p>
              </motion.div>
              <motion.div
                className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <button className="px-8 py-3 bg-[#197ADC] hover:bg-[#197ADC]/90 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-[#197ADC]/30">
                  Get Started
                </button>
                <button className="px-8 py-3 bg-transparent border-2 border-gray-600 hover:border-[#197ADC] text-white font-medium rounded-lg transition-all duration-300 hover:scale-105">
                  Learn More
                </button>
              </motion.div>
            </div>

            {/* --- RIGHT COLUMN (SVG STACK) --- */}
            <div className="mt-12 lg:mt-0 relative flex items-center justify-center h-[500px] lg:h-[600px] overflow-hidden"> 
              
              {/* Main Dashboard Preview Card (Center) */}
              <DashboardCard
                // This card is centered and larger
                className="absolute w-72 md:w-80 lg:w-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                animationDelay={0.2}
                floatingDuration={4.5}
                rotateAmount={1}
              >
                {/* We pass the imported SVG to the img tag */}
                <img src={MainDashboardSVG} alt="Dashboard Preview" className="rounded-xl w-full" />
              </DashboardCard>

              {/* Sales Trend Card - Top Left */}
              <DashboardCard
                className="absolute top-8 left-12 w-48 md:w-52 lg:w-56 z-10"
                animationDelay={0.4}
                floatingDuration={3.5}
                rotateAmount={-3}
              >
                <img src={SalesTrendSVG} alt="Sales Trend" className="rounded-xl w-full" />
              </DashboardCard>

              {/* Today's Overview Card - Bottom Left */}
              <DashboardCard
                className="absolute bottom-16 left-8 w-44 md:w-48 lg:w-52 z-10"
                animationDelay={0.6}
                floatingDuration={3.8}
                rotateAmount={2}
              >
                <img src={TodayOverviewSVG} alt="Today's Overview" className="rounded-xl w-full" />
              </DashboardCard>

              {/* Team Performance Card - Top Right */}
              <DashboardCard
                className="absolute top-12 right-16 w-48 md:w-52 lg:w-56 z-10"
                animationDelay={0.7}
                floatingDuration={4.4}
                rotateAmount={3}
              >
                <img src={TeamPerformanceSVG} alt="Team Performance" className="rounded-xl w-full" />
              </DashboardCard>

              {/* Attendance Card - Bottom Right */}
              <DashboardCard
                className="absolute bottom-20 right-10 w-44 md:w-48 lg:w-52 z-10"
                animationDelay={0.8}
                floatingDuration={3.6}
                rotateAmount={-2}
              >
                <img src={AttendanceSVG} alt="Attendance" className="rounded-xl w-full" />
              </DashboardCard>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;