import React from 'react';
import { motion } from 'framer-motion';

interface BlogDetailContentProps {
  content: string;
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.2 },
  },
};

const BlogDetailContent: React.FC<BlogDetailContentProps> = ({ content }) => (
  <motion.article
    variants={contentVariants}
    initial="hidden"
    animate="visible"
    className="prose prose-gray max-w-none prose-headings:tracking-tight prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-blue-500 prose-blockquote:text-gray-600"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

export default BlogDetailContent;
