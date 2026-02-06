import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import type {
  HeroSectionProps,
  HeroSectionContentProps,
  HeroHighlightsProps,
  HeroCTAGroupProps,
} from './HeroSection.types';
import {
  containerVariants,
  badgeVariants,
  headlineVariants,
  subheadlineVariants,
  pillContainerVariants,
  pillVariants,
  buttonContainerVariants,
  buttonVariants,
  floatingAnimation,
} from './HeroSection.animations';
import dashboardImage from '@/assets/images/hero-section/dashboard-page.jpg';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HeroBackground = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: -100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 1.5, ease: EASE_OUT_EXPO }}
      className="absolute top-20 left-1/4 w-72 h-72 bg-secondary/15 rounded-full blur-[100px]"
    >
      <motion.div
        animate={floatingAnimation({ x: [0, 30, 0], y: [0, -20, 0], duration: 20 })}
        className="w-full h-full"
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 1.5, delay: 0.2, ease: EASE_OUT_EXPO }}
      className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"
    >
      <motion.div
        animate={floatingAnimation({ x: [0, -40, 0], y: [0, 30, 0], duration: 25 })}
        className="w-full h-full"
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.6, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.4, ease: EASE_OUT_EXPO }}
      className="absolute top-1/2 right-1/3 w-64 h-64 bg-secondary/8 rounded-full blur-[100px]"
    >
      <motion.div
        animate={floatingAnimation({ x: [0, 20, 0], y: [0, -30, 0], duration: 22 })}
        className="w-full h-full"
      />
    </motion.div>
  </div>
));

HeroBackground.displayName = 'HeroBackground';

const HeroVisual = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative hidden lg:block w-full h-[520px]"
    >
      {/* Main Dashboard Image - Center */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT_EXPO }}
        className="absolute top-16 left-1/2 -translate-x-1/2 w-[580px] h-[360px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 z-10"
      >
        <img
          src={dashboardImage}
          alt="Dashboard overview"
          className="w-full h-full object-contain bg-white"
        />
      </motion.div>

      {/* Active Teams Card - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT_EXPO }}
        className="absolute top-0 right-4 bg-white rounded-2xl shadow-xl px-6 py-4 z-20"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900">420+</div>
            <div className="text-sm text-gray-600">Active Teams</div>
          </div>
        </div>
      </motion.div>

      {/* Monthly Revenue Card - Bottom Left */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT_EXPO }}
        className="absolute bottom-0 left-0 bg-white rounded-2xl shadow-xl px-6 py-5 z-20"
      >
        <div className="text-sm text-gray-600 mb-1">Monthly Revenue</div>
        <div className="text-4xl font-bold text-gray-900 mb-2">₹1.87M</div>
        <div className="flex items-center space-x-1 text-green-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm font-semibold">23.5%</span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      </motion.div>

      {/* Floating background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/10 rounded-3xl blur-3xl -z-10" />
    </motion.div>
  );
});

const HeroBadge = memo<{ text?: string }>(({ text }) => {
  if (!text) return null;

  return (
    <motion.div
      variants={badgeVariants}
      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 mb-6 sm:mb-8 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 },
        }}
        className="w-2 h-2 bg-secondary rounded-full"
      />
      <span className="text-xs sm:text-sm font-semibold text-white">{text}</span>
    </motion.div>
  );
});

HeroBadge.displayName = 'HeroBadge';

const HeroContent = memo<HeroSectionContentProps>(({ badge, headline, subheadline }) => (
  <>
    <HeroBadge text={badge} />
    <motion.h1
      variants={headlineVariants}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] px-2 sm:px-0"
    >
      {headline}
    </motion.h1>
    <motion.p
      variants={subheadlineVariants}
      className="mt-6 sm:mt-8 text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
    >
      {subheadline}
    </motion.p>
  </>
));

HeroContent.displayName = 'HeroContent';

const HeroHighlights = memo<HeroHighlightsProps>(({ highlights }) => {
  if (!highlights || highlights.length === 0) return null;

  return (
    <motion.div
      variants={pillContainerVariants}
      initial="hidden"
      animate="visible"
      className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-center justify-center px-4 sm:px-0"
    >
      {highlights.map((item, index) => (
        <motion.span
          key={item.id}
          variants={pillVariants}
          whileHover={{
            scale: 1.08,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderColor: 'rgba(249, 115, 22, 0.4)',
            transition: { duration: 0.2 },
          }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-full text-sm sm:text-base text-white cursor-default"
        >
          <motion.span
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
          >
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" aria-hidden="true" />
          </motion.span>
          {item.label}
        </motion.span>
      ))}
    </motion.div>
  );
});

HeroHighlights.displayName = 'HeroHighlights';

const HeroCTAGroup = memo<HeroCTAGroupProps>(({ primaryCta, secondaryCta }) => (
  <motion.div
    variants={buttonContainerVariants}
    initial="hidden"
    animate="visible"
    className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center"
  >
    <motion.button
      variants={buttonVariants}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 25px 50px -12px rgba(249, 115, 22, 0.5)',
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={primaryCta.onClick}
      aria-label={primaryCta.ariaLabel}
      className="group inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-4 sm:py-5 bg-secondary text-white font-semibold rounded-xl shadow-lg shadow-secondary/25 text-lg sm:text-xl transition-colors hover:bg-secondary/90"
    >
      {primaryCta.label}
      <motion.span
        animate={{ x: [0, 6, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 1,
        }}
      >
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
      </motion.span>
    </motion.button>
    {secondaryCta && (
      <motion.button
        variants={buttonVariants}
        whileHover={{
          scale: 1.05,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.97 }}
        onClick={secondaryCta.onClick}
        aria-label={secondaryCta.ariaLabel}
        className="inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 sm:py-5 text-white font-semibold rounded-xl border-2 border-white/30 text-lg sm:text-xl"
      >
        {secondaryCta.label}
      </motion.button>
    )}
  </motion.div>
));

HeroCTAGroup.displayName = 'HeroCTAGroup';

const ScrollIndicator = memo(() => {
  const handleScroll = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="hidden lg:flex absolute bottom-6 left-0 right-0 justify-center z-10">
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        onClick={handleScroll}
        aria-label="Scroll to features"
        className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
});

ScrollIndicator.displayName = 'ScrollIndicator';

/**
 * HeroSection - Enterprise-grade landing page hero component
 *
 * Follows SOLID principles:
 * - SRP: Sub-components handle specific responsibilities
 * - OCP: Extensible via props without modifying internals
 * - ISP: Granular interfaces for different concerns
 * - DIP: Depends on abstractions (callbacks) not implementations
 */
const HeroSection = memo<HeroSectionProps>(
  ({ badge, headline, subheadline, highlights, primaryCta, secondaryCta, className }) => {
    return (
      <section
        id="hero"
        className={cn(
          'relative overflow-hidden bg-primary min-h-screen flex flex-col pt-16 sm:pt-20',
          className
        )}
        aria-labelledby="hero-heading"
      >
        <HeroBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex items-center">
          <div className="py-12 sm:py-16 lg:py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Content */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center lg:text-left"
              >
                <h1 id="hero-heading" className="sr-only">
                  {typeof headline === 'string' ? headline : 'Hero Section'}
                </h1>
                <HeroContent badge={badge} headline={headline} subheadline={subheadline} />
                <HeroHighlights highlights={highlights} />
                <HeroCTAGroup primaryCta={primaryCta} secondaryCta={secondaryCta} />
              </motion.div>

              {/* Right Column - Visual */}
              <HeroVisual />
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';

export default HeroSection;
