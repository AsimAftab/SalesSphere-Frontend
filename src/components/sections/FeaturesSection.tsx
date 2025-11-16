// src/components/sections/FeaturesSection.tsx
import React, { type ReactNode, useMemo } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import underlineStroke from "../../assets/Image/stroke.svg";
import {
  MapPinIcon,
  ShoppingCartIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UsersIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";


/* ----------------------
   Utility: class joiner
   ---------------------- */
const cn = (...classes: (string | boolean | undefined)[]): string =>
  classes.filter(Boolean).join(" ");

/* ----------------------
   Types
   ---------------------- */
type FeatureVariant = "default" | "highlighted" | "gradient";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  variant?: FeatureVariant;
}

/* ----------------------
   Animation variants
   (declared once - not recreated)
   ---------------------- */
const featureContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const featureItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

/* ----------------------
   FeatureCard component
   memoized to avoid re-renders
   ---------------------- */
const FeatureCard: React.FC<FeatureCardProps> = React.memo(
  ({ icon, title, description, variant = "default" }) => {
    const CARD_BG = "bg-white";
    const ICON_BG_DEFAULT = "bg-[#197ADC]";
    const TEXT_COLOR_TITLE_LIGHT = "text-gray-900";
    const TEXT_COLOR_DESCRIPTION_LIGHT = "text-gray-700";

    const isDarkBackground = variant === "highlighted" || variant === "gradient";

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
          return "bg-gradient-to-b from-[#197ADC] to-[#4DA3E8]";
        default:
          return ICON_BG_DEFAULT;
      }
    };

    const getIconGlowClass = (): string => {
      switch (variant) {
        case "gradient":
          return "bg-gradient-to-b from-[#197ADC] to-[#4DA3E8] opacity-30 blur-2xl";
        case "highlighted":
          return "bg-[#163355] opacity-30 blur-2xl";
        case "default":
        default:
          return "bg-gradient-to-b from-[#197ADC] to-blue-300 opacity-30 blur-2xl";
      }
    };

    return (
      <motion.div
        className={cn(
          "group relative w-full h-full rounded-[20px] border border-gray-200/50",
          isDarkBackground ? "shadow-lg shadow-blue-900/30" : "shadow-md",
          getBackgroundClass()
        )}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{
          y: -8,
          boxShadow: isDarkBackground
            ? "0 20px 40px -12px rgba(59, 130, 246, 0.4)"
            : "0 20px 40px -12px rgba(0, 0, 0, 0.12)",
        }}
        role="article"
        aria-label={title}
      >
        <div className="relative z-10 p-8 flex flex-col h-full min-h-[260px]">
          <div className="relative mb-8">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1, y: -4 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <motion.div
                className={cn(
                  "w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-white relative",
                  getIconBackgroundClass()
                )}
              >
                <motion.div whileHover={{ scale: 1.15 }} transition={{ duration: 0.2 }}>
                  {/* Icon should be decorative for screen reader, aria-hidden used on the icon itself */}
                  {icon}
                </motion.div>
              </motion.div>

              <div
                className={cn(
                  "absolute top-0 left-0 w-16 h-16 rounded-2xl -z-10",
                  getIconGlowClass()
                )}
                aria-hidden="true"
                role="presentation"
              />
            </motion.div>
          </div>

          <motion.h3
            className={cn(
              "text-2xl font-bold leading-8 mb-4",
              isDarkBackground ? "text-white" : TEXT_COLOR_TITLE_LIGHT
            )}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {title}
          </motion.h3>

          <motion.p
            className={cn(
              "text-lg font-normal leading-[26px]",
              isDarkBackground ? "text-white/90" : TEXT_COLOR_DESCRIPTION_LIGHT
            )}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

/* ----------------------
   Features data (memoized)
   ---------------------- */
const useFeatures = () =>
  useMemo(
    () => [
      {
        icon: <MapPinIcon className="h-8 w-8 text-white" aria-hidden="true" />,
        title: "GPS Tracking",
        description:
          "Real-time location tracking for sales personnel with automated check-in/check-out and route mapping.",
        variant: "highlighted" as FeatureVariant,
      },
      {
        icon: <ShoppingCartIcon className="h-8 w-8 text-white" aria-hidden="true" />,
        title: "Order Management",
        description:
          "Empower your sales team to create orders, browse the product catalogue, and manage pricing on the go.",
        variant: "highlighted" as FeatureVariant,
      },
      {
        icon: <ShieldCheckIcon className="h-8 w-8 text-white" aria-hidden="true" />,
        title: "Smart Attendance",
        description:
          "Automated check-in/check-out system with GPS verification and attendance reports.",
        variant: "highlighted" as FeatureVariant,
      },
      {
        icon: <ChartBarIcon className="h-8 w-8 text-white" aria-hidden="true" />,
        title: "Analytics Dashboard",
        description:
          "Comprehensive insights into sales performance, territory visibility, and revenue trends.",
        variant: "highlighted" as FeatureVariant,
      },
      {
        icon: <UsersIcon className="h-8 w-8 text-white" aria-hidden="true" />,
        title: "Role-Based Access",
        description:
          "Secure access control for Admin, Managers, Sales Account, and Soap roles.",
        variant: "highlighted" as FeatureVariant,
      },
      {
        icon: <ArchiveBoxIcon className="h-8 w-8 text-white" aria-hidden="true" />,
        title: "Stock Management",
        description:
          "Efficiently track inventory levels and manage stock reconciliation with real-time stock updates.",
        variant: "highlighted" as FeatureVariant,
      },
    ],
    []
  );

/* ----------------------
   FeaturesSection component
   ---------------------- */
const FeaturesSection: React.FC = () => {
  const features = useFeatures();

  return (
    <section id="features" className="bg-gray-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            aria-label="Features section"
          >
            {"Features".split("").map((char, i) => (
              <motion.span
                key={`feature-char-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>

          {/* Underline stroke (decorative) */}
          <motion.div
            className="mt-2 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            aria-hidden="true"
            role="presentation"
          >
            <img
              src={underlineStroke}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-48 h-auto mx-auto"
              aria-hidden="true"
              role="presentation"
              // keep dimensions to reduce layout shift
              width={384}
              height={32}
            />
          </motion.div>

          <motion.p
            className="mt-4 text-lg leading-8 text-black"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Beyond Management: A unified platform engineered to revolutionize field sales performance, delivering the intelligence and automation needed to convert opportunities into revenue faster than ever.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={featureContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="min-h-[327px]"
                variants={featureItemVariants}
                custom={index}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variant={feature.variant}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(FeaturesSection);
