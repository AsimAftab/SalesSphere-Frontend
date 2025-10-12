// src/components/sections/WhyChooseSection.jsx
import React from 'react';

const features = [
  {
    number: '01', title: 'Empower Your Field Teams', description: 'Sales Sphere is the all-in-one platform built to empower field sales teams and transform how businesses manage their operations outside the office.',
  },
  {
    number: '02', title: 'Data-Driven Excellence', description: 'Our mission is to eliminate these complexities by delivering an intuitive, data-driven hub that connects your sales force to headquarter, guaranteeing transparency, efficiency and exponential growth. We turn "infinite sales possibilities" into measurable, managed results.',
  },
  {
    number: '03', title: 'Seamless Operations', description: 'Sales Sphere is the all-in-one platform built to empower field sales teams and transform how businesses manage their operations outside the office.',
  },
];

const WhyChooseSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose <span className="relative whitespace-nowrap"><span className="relative">SalesSphere</span><span className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300 -z-10" aria-hidden="true"/></span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">Transform your field sales operations with our comprehensive platform</p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.number} className="flex flex-col items-start p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
              <div className="text-2xl font-bold text-blue-600">{feature.number}</div>
              <h3 className="mt-4 text-xl font-semibold leading-7 text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-lg bg-slate-50 p-8 sm:flex-row">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Ready to transform your sales?</h3>
            <p className="mt-1 text-gray-600">Schedule the demo today</p>
          </div>
          <a href="#" className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700">Schedule Demo</a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;