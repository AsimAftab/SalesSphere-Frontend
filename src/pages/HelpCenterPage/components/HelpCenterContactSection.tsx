import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { contactVariants } from '../HelpCenterPage.animations';

const HelpCenterContactSection: React.FC = () => (
  <motion.section
    variants={contactVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="mt-16 mb-12"
  >
    <div className="text-center rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-lg p-10 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-100 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
          Still need help?
        </h2>
        <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          Can't find the answer you're looking for? Our support team is here to assist you. Reach out and we'll get back to you within 24 hours.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:support@salessphere360.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/80 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Mail className="h-5 w-5" />
            Email Support
          </a>


        </div>
      </div>
    </div>
  </motion.section>
);

export default HelpCenterContactSection;
