// src/components/sections/WhyChooseSection.jsx
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useModal } from '../modals/LandingPage/Demo/DemoModalContext';
import strokeImage from '@/assets/images/stroke.webp';
import { Button } from '@/components/ui';

const features = [
  {
    number: '01',
    title: 'Empower Your Field Teams',
    description: 'Sales Sphere is the all-in-one platform built to empower field sales teams and transform how businesses manage their operations outside the office.'
  },
  {
    number: '02',
    title: 'Data-Driven Excellence',
    description: 'Our mission is to eliminate complexity with an intuitive, data-driven hub. We connect your sales force to headquarters, guaranteeing transparency and turning infinite possibilities into measurable results.'
  },
  {
    number: '03',
    title: 'Seamless Operations',
    description: 'Sales Sphere is the all-in-one platform built to empower field sales teams and transform how businesses manage their operations outside the office.'
  },
];

const WhyChooseSection = () => {
  const { openDemoModal } = useModal();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section id="About" className="bg-gray-100 py-16 sm:py-24 scroll-mt-28 min-h-[80vh]">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <motion.h2
            className="text-3xl font-bold tracking-tight text-black sm:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {['Why', 'Choose'].map((word, i) => (
              <motion.span
                key={`why-choose-${i}`}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
              >
                {word}
              </motion.span>
            ))}{' '}

            <motion.span
              className="relative whitespace-nowrap inline-block"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <span className="relative z-10">
                <span className="text-secondary">Sales</span>Sphere
              </span>
              <motion.img
                src={strokeImage}
                alt="Underline"
                className="absolute -bottom-2 left-0 w-full h-auto z-0"
                aria-hidden="true"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
              />
            </motion.span>
          </motion.h2>

          <motion.p
            className="mt-4 text-lg leading-8 text-black"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {'Transform your field sales operations with our comprehensive platform'.split(' ').map((word, i) => (
              <motion.span
                key={`desc-${i}`}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.03, duration: 0.25 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>

        {/* FEATURES GRID */}
        <motion.div
          className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              className="relative flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg overflow-hidden"
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 40px -12px rgba(25, 122, 220, 0.25)",
                transition: { duration: 0.3 }
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-secondary shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + index * 0.08, duration: 0.4, type: "spring", stiffness: 250 }}
                whileHover={{ scale: 1.15, rotate: 5 }}
              >
                <span className="text-xl font-bold text-white">{feature.number}</span>

                <motion.div
                  className="absolute inset-0 rounded-full bg-secondary opacity-30 blur-xl"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
              </motion.div>

              <motion.h3
                className="relative z-10 mt-6 text-2xl font-semibold leading-7 text-gray-900"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 + index * 0.08, duration: 0.3 }}
              >
                {feature.title}
              </motion.h3>

              <motion.p
                className="relative z-10 mt-3 text-lg leading-7 text-gray-600"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 1.0 + index * 0.08, duration: 0.3 }}
              >
                {feature.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA BANNER */}
        <motion.div
          className="relative mt-20 mx-auto max-w-lg flex flex-col items-center justify-between gap-6 p-6 sm:flex-row sm:px-8 sm:py-6 rounded-xl bg-white shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.4 }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(25, 122, 220, 0.3)",
            transition: { duration: 0.3 }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5 opacity-0"
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.3, duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold tracking-tight text-gray-900">
              Ready to transform your sales?
            </h3>
            <p className="mt-1 text-black">Schedule the demo today</p>
          </motion.div>

          {/* FIXED: SEO-CRAWLABLE LINK */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.4, duration: 0.3 }}
            className="relative z-10"
          >
            <a
              href="/#demo"
              onClick={(e) => {
                e.preventDefault();
                openDemoModal();
              }}
              className="inline-block"
            >
              <Button variant="secondary">Schedule Demo</Button>
            </a>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default WhyChooseSection;
