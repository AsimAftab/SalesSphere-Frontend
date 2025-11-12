// src/Components/sections/HeroSection.tsx
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const HeroSection = () => {
  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="relative bg-primary overflow-hidden min-h-screen flex items-center pt-20">
      {/* Solid background overlay to protect navbar area */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-primary z-20" />

      {/* Main content container */}
      <div className="relative z-10 w-full py-16 lg:py-24">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="relative lg:grid lg:grid-cols-2 lg:gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Text Column */}
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left flex flex-col justify-center">
              <motion.div variants={itemVariants}>
                {/* Professional Hero Heading with Staggered Animation */}
                <div className="relative overflow-hidden">
                  <motion.h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    {/* Animated word-by-word reveal */}
                    <div className="flex flex-col gap-3">
                      {/* Line 1 - Word by word animation */}
                      <div className="flex flex-wrap gap-3">
                        {["One", "Platform"].map((word, i) => (
                          <motion.span
                            key={`line1-${word}`}
                            className="text-secondary font-bold"
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
                      <div className="flex flex-wrap gap-3">
                        {["Infinite", "Sales"].map((word, i) => (
                          <motion.span
                            key={`line2-${word}`}
                            className="text-white font-bold"
                            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
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
                        {"Possibilities".split("").map((char, i) => (
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
                    animate={{ width: "6rem", opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
                  />
                </div>

                {/* Enhanced Description */}
                <motion.p
                  className="mt-8 text-xl text-gray-300 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  Empower your sales team with{" "}
                  <span className="text-secondary font-semibold">cutting-edge tools</span> and{" "}
                  <span className="text-secondary font-semibold">real-time insights</span> to drive growth and maximize revenue.
                </motion.p>

                {/* Professional CTA Buttons */}
                <motion.div
                  className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <motion.button
                    className="px-8 py-3 bg-secondary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>

                  <motion.button
                    className="px-8 py-3 bg-transparent border-2 border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-white transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Modern animated illustration with shapes and gradients */}
            <motion.div
              className="mt-16 lg:mt-0 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative w-full max-w-4xl h-[700px] mx-auto">

                {/* Animated gradient orbs - More and Larger */}
                <motion.div
                  className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-br from-secondary/30 to-purple-500/30 blur-3xl"
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
                  className="absolute bottom-10 -right-20 w-[450px] h-[450px] rounded-full bg-gradient-to-br from-blue-500/20 to-secondary/20 blur-3xl"
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
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/15 to-orange-500/15 blur-3xl"
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                  }}
                />

                {/* Floating geometric shapes - More shapes */}
                <motion.div
                  className="absolute top-24 right-32"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    className="w-40 h-40 rounded-2xl bg-gradient-to-br from-secondary to-purple-600 shadow-2xl"
                    animate={{
                      rotate: [0, 10, 0],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-40 left-24"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl"
                    animate={{
                      y: [0, -15, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.15 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute bottom-40 left-40"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    className="w-36 h-36 rotate-45 bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl rounded-xl"
                    animate={{
                      rotate: [45, 55, 45],
                      y: [0, -12, 0],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.1, rotate: 60 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute bottom-32 right-24"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg"
                    animate={{
                      y: [0, -18, 0],
                      x: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                </motion.div>

                {/* Additional shapes for fuller look */}
                <motion.div
                  className="absolute top-1/3 right-12"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 shadow-xl"
                    animate={{
                      rotate: [0, -10, 0],
                      y: [0, -16, 0],
                    }}
                    transition={{
                      duration: 4.3,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.15, rotate: -15 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 left-8"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg"
                    animate={{
                      y: [0, -14, 0],
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                </motion.div>

                <motion.div
                  className="absolute top-3/4 right-36"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
                >
                  <motion.div
                    className="w-16 h-16 rotate-45 bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg rounded-md"
                    animate={{
                      rotate: [45, 65, 45],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3.6,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.15, rotate: 70 }}
                  />
                </motion.div>

                {/* Feature Cards with Glassmorphism */}

                {/* Live Tracking */}
                <motion.div
                  className="absolute top-16 right-12"
                  initial={{ opacity: 0, x: 50, rotate: 5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.08, y: -5, rotate: 5 }}
                  >
                    <div className="text-white">
                      <div className="text-2xl mb-2">📍</div>
                      <div className="text-sm font-bold">Live Tracking</div>
                      <div className="text-xs opacity-90 mt-1">Real-time location</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Analytics */}
                <motion.div
                  className="absolute top-1/3 right-4"
                  initial={{ opacity: 0, x: 50, rotate: -5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ delay: 1.3, duration: 0.8 }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-40"
                    animate={{
                      y: [0, -12, 0],
                      rotate: [0, -2, 0],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.08, y: -5, rotate: -5 }}
                  >
                    <div className="text-white">
                      <div className="text-2xl mb-2">📊</div>
                      <div className="text-sm font-bold">Analytics</div>
                      <div className="text-xs opacity-90 mt-1">Deep insights</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Order Management */}
                <motion.div
                  className="absolute top-1/2 left-2"
                  initial={{ opacity: 0, x: -50, rotate: -5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44"
                    animate={{
                      y: [0, -14, 0],
                      rotate: [0, 3, 0],
                    }}
                    transition={{
                      duration: 3.8,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.08, y: -5, rotate: 5 }}
                  >
                    <div className="text-white">
                      <div className="text-2xl mb-2">📦</div>
                      <div className="text-sm font-bold">Order Management</div>
                      <div className="text-xs opacity-90 mt-1">Streamlined process</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Inventory Management */}
                <motion.div
                  className="absolute top-20 left-12"
                  initial={{ opacity: 0, x: -50, rotate: 5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ delay: 1.7, duration: 0.8 }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-40"
                    animate={{
                      y: [0, -11, 0],
                      rotate: [0, -3, 0],
                    }}
                    transition={{
                      duration: 4.2,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.08, y: -5, rotate: -5 }}
                  >
                    <div className="text-white">
                      <div className="text-2xl mb-2">📋</div>
                      <div className="text-sm font-bold">Inventory</div>
                      <div className="text-xs opacity-90 mt-1">Stock control</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Smart Attendance */}
                <motion.div
                  className="absolute bottom-16 right-8"
                  initial={{ opacity: 0, y: 50, rotate: 5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 1.9, duration: 0.8 }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44"
                    animate={{
                      y: [0, -13, 0],
                      rotate: [0, 2, 0],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.08, y: -5, rotate: 5 }}
                  >
                    <div className="text-white">
                      <div className="text-2xl mb-2">⏰</div>
                      <div className="text-sm font-bold">Smart Attendance</div>
                      <div className="text-xs opacity-90 mt-1">Auto tracking</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Role Based Access */}
                <motion.div
                  className="absolute bottom-8 left-24"
                  initial={{ opacity: 0, y: 50, rotate: -5 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 2.1, duration: 0.8 }}
                >
                  <motion.div
                    className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-xl p-4 shadow-2xl w-44"
                    animate={{
                      y: [0, -9, 0],
                      rotate: [0, -2, 0],
                    }}
                    transition={{
                      duration: 4.8,
                      repeat: Infinity,
                    }}
                    whileHover={{ scale: 1.08, y: -5, rotate: -5 }}
                  >
                    <div className="text-white">
                      <div className="text-2xl mb-2">🔐</div>
                      <div className="text-sm font-bold">Role Based Access</div>
                      <div className="text-xs opacity-90 mt-1">Secure permissions</div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Animated lines connecting elements */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
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
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
                      <stop offset="50%" stopColor="#818CF8" stopOpacity="1" />
                      <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
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