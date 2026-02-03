import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/SuperadminComponents/utils';
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
  waveVariants,
} from './HeroSection.animations';

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

const HeroBadge = memo<{ text?: string }>(({ text }) => {
  if (!text) return null;

  return (
    <motion.div
      variants={badgeVariants}
      className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
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
      <span className="text-sm font-semibold text-white">{text}</span>
    </motion.div>
  );
});

HeroBadge.displayName = 'HeroBadge';

const HeroContent = memo<HeroSectionContentProps>(({ badge, headline, subheadline }) => (
  <>
    <HeroBadge text={badge} />
    <motion.h1
      variants={headlineVariants}
      className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1]"
    >
      {headline}
    </motion.h1>
    <motion.p
      variants={subheadlineVariants}
      className="mt-8 text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
    >
      {subheadline}
    </motion.p>
  </>
));

HeroContent.displayName = 'HeroContent';

const HeroHighlights = memo<HeroHighlightsProps>(({ highlights }) => (
  <motion.div
    variants={pillContainerVariants}
    initial="hidden"
    animate="visible"
    className="mt-10 flex flex-wrap gap-3 justify-center"
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
        className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white cursor-default"
      >
        <motion.span
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
        >
          <CheckCircle2 className="w-4 h-4 text-secondary" aria-hidden="true" />
        </motion.span>
        {item.label}
      </motion.span>
    ))}
  </motion.div>
));

HeroHighlights.displayName = 'HeroHighlights';

const HeroCTAGroup = memo<HeroCTAGroupProps>(({ primaryCta, secondaryCta }) => (
  <motion.div
    variants={buttonContainerVariants}
    initial="hidden"
    animate="visible"
    className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
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
      className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-white font-semibold rounded-xl shadow-lg shadow-secondary/25 text-lg transition-colors hover:bg-secondary/90"
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
        <ArrowRight className="w-5 h-5" aria-hidden="true" />
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
        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-medium rounded-xl border border-white/20 text-lg"
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
    <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
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

const HeroWave = memo(() => (
  <motion.div
    variants={waveVariants}
    initial="hidden"
    animate="visible"
    className="absolute bottom-0 left-0 right-0"
  >
    <svg
      viewBox="0 0 1440 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
    >
      <path
        d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z"
        fill="white"
      />
    </svg>
  </motion.div>
));

HeroWave.displayName = 'HeroWave';

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
        className={cn('relative overflow-hidden bg-primary min-h-screen flex flex-col', className)}
        aria-labelledby="hero-heading"
      >
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex items-center">
          <div className="py-20 w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center"
            >
              <h1 id="hero-heading" className="sr-only">
                {typeof headline === 'string' ? headline : 'Hero Section'}
              </h1>
              <HeroContent badge={badge} headline={headline} subheadline={subheadline} />
              <HeroHighlights highlights={highlights} />
              <HeroCTAGroup primaryCta={primaryCta} secondaryCta={secondaryCta} />
            </motion.div>
          </div>
        </div>

        <ScrollIndicator />
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';

export default HeroSection;
