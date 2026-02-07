import { memo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Store, ShoppingCart, Clock, IndianRupee } from 'lucide-react';
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
import logoCircle from '@/assets/images/logo-c.svg';
import dashboardIcon from '@/assets/images/icons/dashboard-icon.svg';
import trackingIcon from '@/assets/images/icons/tracking-icon.svg';
import productsIcon from '@/assets/images/icons/products-icon.svg';
import ordersIcon from '@/assets/images/icons/orders-icon.svg';
import employeesIcon from '@/assets/images/icons/employees-icon.svg';
import attendanceIcon from '@/assets/images/icons/attendance-icon.svg';
import partiesIcon from '@/assets/images/icons/parties-icon.svg';
import analyticsIcon from '@/assets/images/icons/analytics-icon.svg';
import beatPlanIcon from '@/assets/images/icons/beat-plan-icon.svg';
import settingsIcon from '@/assets/images/icons/settings-icon.svg';
import logoutIcon from '@/assets/images/icons/logout-icon.svg';

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

const HERO_NAV_ITEMS = [
  { name: 'Dashboard', icon: dashboardIcon, active: true },
  { name: 'Live Tracking', icon: trackingIcon },
  { name: 'Products', icon: productsIcon },
  { name: 'Order Lists', icon: ordersIcon },
  { name: 'Employees', icon: employeesIcon },
  { name: 'Attendance', icon: attendanceIcon },
  { name: 'Parties', icon: partiesIcon },
  { name: 'Analytics', icon: analyticsIcon },
  { name: 'Beat Plan', icon: beatPlanIcon },
];

const ATTENDANCE_ITEMS = [
  { label: 'Present', color: 'bg-green-500', count: 8 },
  { label: 'Half Day', color: 'bg-blue-500', count: 1 },
  { label: 'Absent', color: 'bg-red-500', count: 2 },
  { label: 'On Leave', color: 'bg-yellow-500', count: 1 },
  { label: 'Weekly Off', color: 'bg-purple-500', count: 0 },
];

const HeroVisual = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3, ease: EASE_OUT_EXPO }}
    className="relative w-full lg:scale-[1.05] xl:scale-[1.03] 2xl:scale-100 lg:origin-top-right"
  >
    {/* App window */}
    <div
      className="rounded-xl overflow-hidden border border-white/20"
      style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 0 40px rgba(25,122,220,0.12)' }}
    >
      {/* App content */}
      <div className="flex bg-white">
        {/* Sidebar - full height */}
        <div className="border-r border-gray-100 p-2.5 w-[130px] xl:w-[145px] bg-white flex-shrink-0 flex flex-col">
          <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-gray-100">
            <img src={logoCircle} alt="" className="w-5 h-5" />
            <span className="text-[8px] font-bold tracking-tight">
              <span className="text-secondary">Sales</span>
              <span className="text-gray-800">Sphere</span>
            </span>
          </div>
          <div className="space-y-px">
            {HERO_NAV_ITEMS.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-1.5 px-1.5 py-[3.5px] rounded-md ${item.active ? 'bg-primary' : ''}`}
              >
                <img
                  src={item.icon}
                  alt=""
                  className={`w-3 h-3 flex-shrink-0 ${item.active ? '[filter:brightness(0)_invert(1)]' : ''}`}
                />
                <span className={`text-[7px] font-semibold truncate ${item.active ? 'text-white' : 'text-gray-500'}`}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
          <div className="flex-1" />
          <div className="border-t border-gray-100 pt-1.5 space-y-px">
            <div className="flex items-center gap-1.5 px-1.5 py-[3.5px]">
              <img src={settingsIcon} alt="" className="w-3 h-3" />
              <span className="text-[7px] font-semibold text-gray-500">Settings</span>
            </div>
            <div className="flex items-center gap-1.5 px-1.5 py-[3.5px]">
              <img src={logoutIcon} alt="" className="w-3 h-3" />
              <span className="text-[7px] font-semibold text-gray-500">Logout</span>
            </div>
          </div>
        </div>

        {/* Right: Header + Dashboard stacked */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-[7.5px] font-bold text-gray-800">SalesSphere Demo Corp</span>
              <div className="h-3 w-px bg-gray-200" />
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
                <span className="text-[6px] font-semibold text-emerald-600"><span className="font-bold">365</span> days remaining</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-bold text-white">S</span>
              </div>
              <div>
                <p className="text-[6.5px] font-semibold text-gray-800 leading-tight">SalesSphere</p>
                <p className="text-[5.5px] text-gray-400">Admin</p>
              </div>
            </div>
          </div>

          {/* Main dashboard area */}
          <div className="flex-1 bg-[#f8f9fb] p-3 min-w-0">
            {/* Greeting */}
            <div className="mb-2">
              <p className="text-[9px] font-bold text-gray-800">Good Evening, <span className="text-secondary">Admin!</span></p>
              <p className="text-[5px] text-gray-400">Saturday, February 7, 2026</p>
            </div>

            {/* 5 Stat cards */}
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {[
                { label: 'TOTAL NO. OF PARTIES', value: '156', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', Icon: Store },
                { label: "TODAY'S TOTAL PARTIES", value: '12', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', Icon: Store },
                { label: "TODAY'S TOTAL ORDERS", value: '38', iconBg: 'bg-purple-100', iconColor: 'text-purple-600', Icon: ShoppingCart },
                { label: 'TOTAL PENDING ORDERS', value: '7', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', Icon: Clock },
                { label: "TODAY'S ORDER VALUE", value: 'Rs 19,600', iconBg: 'bg-green-100', iconColor: 'text-green-600', Icon: IndianRupee },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg p-1.5 border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[4px] text-gray-400 uppercase tracking-wider mb-0.5 leading-tight">{stat.label}</p>
                    <p className="text-[9px] font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <stat.Icon className={`w-2.5 h-2.5 ${stat.iconColor}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Middle row: Team Performance + Attendance + Live Field */}
            <div className="grid grid-cols-3 gap-1.5">
              {/* Team Performance Today */}
              <div className="bg-white rounded-lg p-2 border border-gray-100">
                <p className="text-[6.5px] font-bold text-gray-700 mb-2">Team Performance Today</p>
                <div className="space-y-1.5">
                  {[
                    { name: 'Rahul Sharma', role: 'Sales Executive', init: 'R', amount: '₹8,450', orders: 6 },
                    { name: 'Priya Mehta', role: 'Sales Executive', init: 'P', amount: '₹5,220', orders: 4 },
                    { name: 'Ankit Verma', role: 'Sales Executive', init: 'A', amount: '₹3,180', orders: 3 },
                    { name: 'Neha Gupta', role: 'Sales Executive', init: 'N', amount: '₹2,750', orders: 2 },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <span className="text-[5px] font-bold text-white">{m.init}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[5px] font-semibold text-gray-700 truncate">{m.name}</p>
                        <p className="text-[3.5px] text-gray-400">{m.role}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[5px] font-bold text-green-600">{m.amount}</p>
                        <p className="text-[3.5px] text-gray-400">{m.orders} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="bg-white rounded-lg p-2 border border-gray-100">
                <p className="text-[6.5px] font-bold text-gray-700 mb-1">Attendance Summary</p>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[11px] font-bold text-green-500">83%</span>
                  <span className="text-[4.5px] text-gray-400">12 Team Members</span>
                </div>
                <div className="w-full h-[3px] bg-gray-100 rounded-full mb-1.5">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '83%' }} />
                </div>
                <div className="space-y-[3px]">
                  {ATTENDANCE_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className={`w-1 h-1 rounded-full ${item.color}`} />
                        <span className="text-[4.5px] text-gray-500">{item.label}</span>
                      </div>
                      <span className="text-[4.5px] font-semibold text-gray-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Field Activities */}
              <div className="bg-white rounded-lg p-2 border border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[6.5px] font-bold text-gray-700">Live Field Activities</p>
                  <div className="flex items-center gap-0.5">
                    <svg viewBox="0 0 24 24" className="w-2 h-2 text-secondary" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
                    </svg>
                    <span className="text-[4.5px] font-semibold text-secondary">5 Active</span>
                  </div>
                </div>
                <div>
                  {[
                    { name: 'Rahul Sharma', init: 'R', role: 'Sales Executive', beat: 'Beat: Route 5 - Rahul' },
                    { name: 'Priya Mehta', init: 'P', role: 'Sales Executive', beat: 'Beat: Route 4 - Priya' },
                    { name: 'Ankit Verma', init: 'A', role: 'Sales Executive', beat: 'Beat: Route 3 - Ankit' },
                  ].map((emp, i) => (
                    <div key={emp.name}>
                      <div className="flex items-center gap-1.5 py-1">
                        <div className="w-3.5 h-3.5 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <span className="text-[4.5px] font-bold text-white">{emp.init}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[5px] font-semibold text-gray-700 truncate">{emp.name}</p>
                          <p className="text-[3.5px] text-gray-400">{emp.role}</p>
                        </div>
                        <span className="text-[3.5px] text-gray-400 flex-shrink-0">{emp.beat}</span>
                      </div>
                      {i < 2 && <div className="border-t border-gray-50" />}
                    </div>
                  ))}
                  <p className="text-[4.5px] text-secondary font-semibold mt-1 text-center">View All Live Employees →</p>
                </div>
              </div>
            {/* Sales Trend */}
            <div className="bg-white rounded-lg p-2 border border-gray-100 col-span-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[6.5px] font-bold text-gray-700">Sales Trend (Last 7 Days)</p>
                <span className="text-[5px] text-green-600 font-semibold bg-green-50 px-1.5 py-0.5 rounded-full">+23.5%</span>
              </div>
              <svg viewBox="0 0 340 80" className="w-full h-[65px]">
                {/* Y-axis labels */}
                {[0, 5000, 10000, 15000, 20000].map((val, i) => {
                  const y = 65 - i * 15;
                  return (
                    <g key={val}>
                      <text x="28" y={y + 1} textAnchor="end" className="fill-gray-400" style={{ fontSize: '4px' }}>{`₹${val / 1000}k`}</text>
                      <line x1="32" y1={y} x2="330" y2={y} stroke="#E5E7EB" strokeWidth="0.3" strokeDasharray="2 2" />
                    </g>
                  );
                })}
                {/* Bars + X-axis labels */}
                {['Feb 1', 'Feb 2', 'Feb 3', 'Feb 4', 'Feb 5', 'Feb 6', 'Feb 7'].map((d, i) => {
                  const heights = [28, 42, 35, 55, 38, 48, 32];
                  const barWidth = 28;
                  const gap = 14;
                  const x = 40 + i * (barWidth + gap);
                  const isLast = i === 6;
                  return (
                    <g key={d}>
                      <rect x={x} y={65 - heights[i]} width={barWidth} rx="2" height={heights[i]} fill={isLast ? '#197ADC' : '#94C7F3'} />
                      <text x={x + barWidth / 2} y="75" textAnchor="middle" className="fill-gray-400" style={{ fontSize: '4px' }}>{d}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Glow behind the window */}
    <div className="absolute -inset-4 bg-secondary/10 rounded-2xl blur-2xl -z-10" />
  </motion.div>
));

HeroVisual.displayName = 'HeroVisual';

const HeroBadge = memo<{ text?: string }>(({ text }) => {
  if (!text) return null;

  return (
    <motion.div
      variants={badgeVariants}
      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 mb-4 sm:mb-6 lg:mb-8 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm"
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
      className="text-3xl sm:text-4xl md:text-5xl lg:text-3xl xl:text-5xl 2xl:text-6xl font-bold leading-[1.1] px-2 sm:px-0"
    >
      {headline}
    </motion.h1>
    <motion.p
      variants={subheadlineVariants}
      className="mt-5 sm:mt-6 lg:mt-6 text-base sm:text-lg lg:text-base xl:text-lg 2xl:text-xl text-gray-300 max-w-3xl mx-auto lg:mx-0 lg:max-w-md xl:max-w-lg leading-relaxed px-4 sm:px-0"
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
      className="mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-center justify-center lg:justify-start px-4 sm:px-0"
    >
      {highlights.map((item, index) => (
        <motion.span
          key={item.id}
          variants={pillVariants}
          whileHover={{
            scale: 1.08,
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            borderColor: 'rgba(25, 122, 220, 0.4)',
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
    className="mt-8 sm:mt-10 lg:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0"
  >
    <motion.button
      variants={buttonVariants}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 25px 50px -12px rgba(25, 122, 220, 0.5)',
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.97 }}
      onClick={primaryCta.onClick}
      aria-label={primaryCta.ariaLabel}
      className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-white font-semibold rounded-xl shadow-lg shadow-secondary/25 text-sm sm:text-base lg:text-base whitespace-nowrap transition-colors hover:bg-secondary/90"
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
          boxShadow: '0 25px 50px -12px rgba(25, 122, 220, 0.3)',
          borderColor: 'rgba(25, 122, 220, 0.5)',
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.97 }}
        onClick={secondaryCta.onClick}
        aria-label={secondaryCta.ariaLabel}
        className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold rounded-xl border-2 border-white/30 text-sm sm:text-base lg:text-base whitespace-nowrap"
      >
        {secondaryCta.label}
      </motion.button>
    )}
  </motion.div>
));

HeroCTAGroup.displayName = 'HeroCTAGroup';

const HeroSection = memo<HeroSectionProps>(
  ({ badge, headline, subheadline, highlights, primaryCta, secondaryCta, className }) => {
    return (
      <section
        id="hero"
        className={cn(
          'relative overflow-hidden bg-primary flex flex-col pt-16 sm:pt-20 lg:min-h-screen',
          className
        )}
        aria-labelledby="hero-heading"
      >
        <HeroBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:flex-1 lg:flex lg:items-center">
          <div className="w-full py-8 pb-12 sm:py-12 sm:pb-16 lg:py-0 lg:pb-0">
            <div className="grid lg:grid-cols-2 xl:grid-cols-[1fr_1.3fr] 2xl:grid-cols-[1fr_1.4fr] gap-8 lg:gap-8 xl:gap-10 items-center">
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

      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';

export default HeroSection;
