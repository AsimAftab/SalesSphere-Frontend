import React from 'react';

interface BlogDetailContentProps {
  content: string;
}

const BlogDetailContent: React.FC<BlogDetailContentProps> = ({ content }) => (
  <article
    className="prose prose-xl prose-gray max-w-none text-gray-800 text-justify
      prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-gray-900 prose-h2:mt-12 prose-h2:mb-6 prose-h3:mt-8
      prose-p:text-gray-700 prose-p:leading-8 prose-p:text-justify 
      prose-a:text-primary prose-a:font-medium prose-a:underline prose-a:decoration-secondary/30 prose-a:underline-offset-4 hover:prose-a:decoration-secondary hover:prose-a:text-secondary transition-all
      prose-strong:text-gray-900 prose-strong:font-bold
      prose-img:rounded-2xl prose-img:shadow-lg prose-img:ring-1 prose-img:ring-gray-100 prose-img:my-10
      prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-semibold prose-code:text-primary
      prose-pre:bg-slate-900 prose-pre:shadow-xl prose-pre:rounded-2xl prose-pre:p-6
      prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-800 prose-blockquote:bg-gray-50/50 prose-blockquote:rounded-r-lg
      prose-li:text-gray-700 prose-li:marker:text-secondary
      marker:text-secondary"
    dangerouslySetInnerHTML={{ __html: content }}
  />
);

export default BlogDetailContent;
