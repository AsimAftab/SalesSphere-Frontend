import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useModal } from '../modals/LandingPage/Demo/DemoModalContext';
import {
  BarChart2,
  ClipboardList,
  Clock,
  Lock,
  MapPin,
  Package,
} from 'lucide-react';

const HeroSection = () => {
  const { openDemoModal } = useModal();

  const handleScrollToFooter = () => {
    const footerElement = document.getElementById('footer');
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div id='top' className="relative bg-primary overflow-hidden min-h-screen flex items-center">
      <div className="relative z-10 w-full py-16 lg:py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="relative lg:grid lg:grid-cols-2 lg:gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="mx-auto max-w-2xl text-left lg:mx-0 lg:text-left flex flex-col justify-center">
              <motion.div variants={itemVariants}>
                <div className="relative overflow-hidden">
                  <motion.h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    <div className="flex flex-col gap-3">
                      {/* Line 1 - Word by word animation */}
                      <div className="flex flex-wrap gap-3 lg:justify-start">
                        {['One', 'Platform'].map((word, i) => (
                          <motion.span
                            key={`line1-${word}`}
                            className="text-secondary font-bold"
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{
                              delay: i * 0.1,
                              duration: 0.5,
                            }}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>

                      {/* Line 2 - Word by word animation */}
                      <div className="flex flex-wrap gap-3 lg:justify-start">
                        {['Infinite', 'Sales'].map((word, i) => (
                          <motion.span
                            key={`line2-${word}`}
                            className="text-white font-bold"
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{
                              delay: 0.2 + i * 0.1,
                              duration: 0.5,
                            }}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>

                      {/* Line 3 - Single word with character stagger */}
                      <motion.div
                        className="text-white font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {'Possibilities'.split('').map((char, i) => (
                          <motion.span
                            key={`char-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.5 + i * 0.03,
                              duration: 0.3,
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.div>
                    </div>
                  </motion.h1>

                  {/* Animated decorative line */}
                  <motion.div
                    className="mt-6 h-1 bg-secondary rounded-full"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '6rem', opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
                  />
                </div>

                {/* Enhanced Description */}
                <motion.p
                  className="mt-8 text-xl text-gray-200 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  Empower your sales team with{' '}
                  <span className="text-secondary font-semibold">
                    cutting-edge tools
                  </span>{' '}
                  and{' '}
                  <span className="text-secondary font-semibold">
                    real-time insights
                  </span>{' '}
                  to drive growth and maximize revenue.
                </motion.p>

                {/* Professional CTA Buttons */}
                <motion.div
                  className="mt-10 flex flex-wrap gap-4 lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <motion.button
                    type="button"
                    className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openDemoModal}
                  >
                    Schedule Demo
                  </motion.button>

                  <motion.button
                    type="button"
                    className="px-8 py-3 bg-transparent border-2 border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-white transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleScrollToFooter}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* --- HUMAN-FEEL ANIMATION APPLIED TO THIS SECTION --- */}
            <motion.div
              className="mt-16 lg:mt-0 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full max-w-4xl h-[700px] mx-auto">
                {/* --- AMBIENT BACKGROUND --- */}
                {/* These still loop infinitely to create atmosphere */}
                <motion.div
                  className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-600/40 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 30, 0],
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="absolute bottom-10 -right-20 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-700/30 to-cyan-600/30 blur-3xl"
                  animate={{
                    scale: [1, 1.3, 1],
                    x: [0, -30, 0],
                    y: [0, 20, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-pink-700/20 to-orange-700/20 blur-3xl"
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                  }}
                />

                {/* --- INTERACTIVE FOREGROUND --- */}
                {/* These animate in ONCE, then only move on HOVER */}
                <motion.div
                  className="absolute top-24 right-32"
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="w-40 h-40 rounded-2xl bg-gradient-to-br from-secondary/80 to-purple-500/80 shadow-2xl cursor-pointer"
                    whileHover={{ scale: 1.15, rotate: 10, y: -15 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-40 left-24"
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/80 to-cyan-500/80 shadow-xl cursor-pointer"
                    whileHover={{ scale: 1.2, y: -15 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute bottom-40 left-40"
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="w-36 h-36 rotate-45 bg-gradient-to-br from-purple-500/80 to-pink-500/80 shadow-xl rounded-xl cursor-pointer"
                    whileHover={{ scale: 1.15, rotate: 60, y: -15 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute bottom-32 right-24"
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400/80 to-red-500/80 shadow-lg cursor-pointer"
                    whileHover={{ scale: 1.25, y: -15 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-1/3 right-12"
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-400/80 to-emerald-500/80 shadow-xl cursor-pointer"
                    whileHover={{ scale: 1.2, rotate: -15, y: -10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-8"
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400/80 to-amber-500/80 shadow-lg cursor-pointer"
                    whileHover={{ scale: 1.25, y: -10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-3/4 right-36"
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="w-16 h-16 rotate-45 bg-gradient-to-br from-teal-400/80 to-cyan-500/80 shadow-lg rounded-md cursor-pointer"
                    whileHover={{ scale: 1.2, rotate: 70, y: -10 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  />
                </motion.div>

                {/* Feature Cards with Glassmorphism */}
                {/* Live Tracking */}
                <motion.div
                  className="absolute top-16 right-12"
                  initial={{ opacity: 0, x: 50, rotate: 5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.1, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -10, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <div className="text-white">
                      <MapPin className="w-6 h-6 mb-2 text-red-400" />
                      <div className="text-sm font-bold">Live Tracking</div>
                      <div className="text-xs text-white/95 mt-1">
                        Real-time location
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Analytics */}
                <motion.div
                  className="absolute top-1/3 right-4"
                  initial={{ opacity: 0, x: 50, rotate: -5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-40 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -10, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <div className="text-white">
                      <BarChart2 className="w-6 h-6 mb-2 text-emerald-400" />
                      <div className="text-sm font-bold">Analytics</div>
                      <div className="text-xs text-white/95 mt-1">
                        Deep insights
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Order Management */}
                <motion.div
                  className="absolute top-1/2 left-2"
                  initial={{ opacity: 0, x: -50, rotate: -5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.5, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -10, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <div className="text-white">
                      <Package className="w-6 h-6 mb-2 text-amber-400" />
                      <div className="text-sm font-bold">Order Management</div>
                      <div className="text-xs text-white/95 mt-1">
                        Streamlined process
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Inventory Management */}
                <motion.div
                  className="absolute top-20 left-12"
                  initial={{ opacity: 0, x: -50, rotate: 5 }}
                  whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.7, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-40 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -10, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <div className="text-white">
                      <ClipboardList className="w-6 h-6 mb-2 text-indigo-400" />
                      <div className="text-sm font-bold">Inventory</div>
                      <div className="text-xs text-white/95 mt-1">
                        Stock control
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Smart Attendance */}
                <motion.div
                  className="absolute bottom-16 right-8"
                  initial={{ opacity: 0, y: 50, rotate: 5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.9, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -10, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <div className="text-white">
                      <Clock className="w-6 h-6 mb-2 text-pink-400" />
                      <div className="text-sm font-bold">Smart Attendance</div>
                      <div className="text-xs text-white/95 mt-1">
                        Auto tracking
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Role Based Access */}
                <motion.div
                  className="absolute bottom-8 left-24"
                  initial={{ opacity: 0, y: 50, rotate: -5 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.1, duration: 0.8, type: 'spring' }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44 cursor-pointer"
                    whileHover={{ scale: 1.1, y: -10, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  >
                    <div className="text-white">
                      <Lock className="w-6 h-6 mb-2 text-purple-400" />
                      <div className="text-sm font-bold">Role Based Access</div>
                      <div className="text-xs text-white/95 mt-1">
                        Secure permissions
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* --- AMBIENT BACKGROUND (Continued) --- */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ zIndex: -1 }}
                >
                  <motion.path
                    d="M 100 200 Q 300 250 500 150"
                    stroke="url(#gradient1)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ delay: 1.5, duration: 2 }}
                  />
                  <motion.path
                    d="M 150 400 Q 300 350 480 450"
                    stroke="url(#gradient2)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ delay: 1.7, duration: 2 }}
                  />
                  <defs>
                    <linearGradient
                      id="gradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
                      <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="gradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#A78BFA" stopOpacity="0" />
                      <stop offset="50%" stopColor="#A78BFA" stopOpacity="1" />
                      <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Floating particles - More particles */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full bg-secondary"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -40, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}

                {/* Additional accent circles */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`accent-${i}`}
                    className="absolute rounded-full border-2 border-secondary/30"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      width: `${40 + Math.random() * 60}px`,
                      height: `${40 + Math.random() * 60}px`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.1, 0.3, 0.1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;