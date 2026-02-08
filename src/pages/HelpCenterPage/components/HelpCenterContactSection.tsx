import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { contactVariants } from '../HelpCenterPage.animations';

const HelpCenterContactSection: React.FC = () => (
  <motion.section
    variants={contactVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="mt-12"
  >
    <div className="text-center rounded-xl bg-white border border-gray-200 shadow-sm p-8 md:p-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
        Still need help?
      </h2>
      <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
        Our support team is here to assist you. Reach out and we'll get back to you within 24 hours.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="mailto:support@salessphere360.com"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Mail className="h-4 w-4" />
          support@salessphere360.com
        </a>

        <a
          href="tel:+977981903166"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <Phone className="h-4 w-4" />
          +977-981903166
        </a>
      </div>
    </div>
  </motion.section>
);

export default HelpCenterContactSection;
