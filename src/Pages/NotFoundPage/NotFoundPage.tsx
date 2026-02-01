import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion

// Import both SVG files
import illustration404 from '../../assets/Image/404_illustration.webp';
import backgroundDecorations404 from '../../assets/Image/404_decoration_background.svg';
import Button from '../../components/UI/Button/Button';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    // Main container: full screen, relative for absolute positioning of children, overflow hidden.
    <div className="relative w-full h-screen overflow-hidden bg-[#1a202c]"> {/* Using a dark background color similar to your decoration SVG */}
      
      {/* Background Decorations SVG */}
      {/* This image will stretch to fill the background and fade in */}
      <motion.img
        src={backgroundDecorations404}
        alt="404 Background Decorations"
        className="absolute inset-0 w-full h-full object-cover" // Ensure it covers the whole screen
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }} // A slower fade for the background
      />

      {/* Main Illustration SVG */}
      {/* --- THIS BLOCK IS FIXED --- */}
      {/* Note: no ' ** ' around the 'x' properties */}
      <motion.img
        src={illustration404}
        alt="404 Error Illustration"
        className="relative z-10 max-w-4xl w-full h-auto object-contain p-4 mx-auto" 
        initial={{ opacity: 0, y: 80, x: 60 }} // Set initial x position
        animate={{ opacity: 1, y: 0, x: 60 }}  // Set final x position
        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }} 
      />
      {/* --- END OF FIXED BLOCK --- */}

      {/* Button - Top Right Corner */}
      <motion.div
        className="absolute top-6 right-6 z-20" // Higher z-index to ensure it's above everything
        initial={{ opacity: 0, y: -50 }} // Start transparent and above
        animate={{ opacity: 1, y: 0 }}    // Animate to full opacity and original position
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }} // Delay it further to appear last
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="secondary"
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 shadow-lg"
        >
          Go to Homepage
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;