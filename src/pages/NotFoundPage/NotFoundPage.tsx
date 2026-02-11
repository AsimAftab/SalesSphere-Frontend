import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/api/auth/useAuth';

// Import both SVG files
import illustration404 from '@/assets/images/404_illustration.webp';
import backgroundDecorations404 from '@/assets/images/404_decoration_background.svg';
import { Button } from '@/components/ui';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isSuperAdmin, isAdmin } = useAuth();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#1a202c] flex items-center justify-center p-6 sm:p-10">
      {/* Background Decorations SVG */}
      <motion.img
        src={backgroundDecorations404}
        alt="Background Decorations"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Illustration */}
        <motion.div
          className="order-2 lg:order-1 flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.img
            src={illustration404}
            alt="404 Error Illustration"
            className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Right Column: Content */}
        <div className="order-1 lg:order-2 text-center lg:text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                Oops! <br />
                Page Not Found
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                variant="secondary"
                onClick={() => {
                  if (isAuthenticated) {
                    // Logged in users go to their respective dashboards
                    if (isSuperAdmin || isAdmin) {
                      navigate('/system-admin/dashboard');
                      // Note: isAdmin usually goes to /admin-panel but let's stick to dashboard if that's the main entry
                      // checking AppRoutes: /admin-panel is for org admins. 
                      // Let's safe default to /dashboard which handles routing or is the main app
                      navigate('/dashboard');
                    } else {
                      navigate('/dashboard');
                    }
                  } else {
                    // Guests go to landing page
                    navigate('/');
                  }
                }}
                className="px-8 py-6 text-base font-semibold shadow-xl shadow-blue-500/20"
              >
                Go to Homepage
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;