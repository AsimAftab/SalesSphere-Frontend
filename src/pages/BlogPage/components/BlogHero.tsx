import React from 'react';
import { motion } from 'framer-motion';
import { heroVariants } from '../BlogListPage.animations';

const BlogHero: React.FC = () => (
  <motion.section
    variants={heroVariants}
    initial="hidden"
    animate="visible"
    className="text-center mb-16"
  >
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
          Blogs
        </span>
      </h1>
    </div>
  </motion.section>
);

export default BlogHero;
