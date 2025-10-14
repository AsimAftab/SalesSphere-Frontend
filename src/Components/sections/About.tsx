// src/components/sections/WhyChooseSection.jsx
import React from 'react';
import strokeImage from '../../assets/Image/stroke.svg'; // Make sure this path is correct!

const features = [
  {
    number: '01', 
    title: 'Empower Your Field Teams', 
    description: 'Sales Sphere is the all-in-one platform built to empower field sales teams and transform how businesses manage their operations outside the office.' 
  },
  {
    number: '02', 
    title: 'Data-Driven Excellence', 
    description: 'Our mission is to eliminate these complexities by delivering an intuitive, data-driven hub that connects your sales force to headquarter, guaranteeing transparency, efficiency and exponential growth. We turn "infinite sales possibilities" into measurable, managed results.' 
  },
  {
    number: '03', 
    title: 'Seamless Operations', 
    description: 'Sales Sphere is the all-in-one platform built to empower field sales teams and transform how businesses manage their operations outside the office.' 
  },
];

const WhyChooseSection = () => {
  return (
    <section className="bg-gray-100 py-16 sm:py-24">
      <div className=" px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* --- FIX 1: Header Underline with proper layering --- */}
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose <span className="relative whitespace-nowrap">
              {/* This span places the text on a higher layer (z-10) */}
              <span className="relative z-10">SalesSphere</span>
              {/* This image is the underline, on a lower layer (z-0) */}
              <br></br>
              <img 
                src={strokeImage} 
                alt="Underline" 
                className="absolute -bottom-2 left-0 w-full h-auto z-0" 
              />
            </span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Transform your field sales operations with our comprehensive platform 
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.number} className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <span className="text-xl font-bold text-white">{feature.number}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-7 text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base leading-7 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* --- FIX 2: CTA Banner styled to perfectly match the Figma design --- */}
        <div className="mt-20 flex flex-col items-center justify-between gap-6 rounded-2xl bg-white p-8 sm:flex-row shadow-xl">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-gray-900">Ready to transform your sales? </h3>
            <p className="mt-1 text-gray-600">Schedule the demo today </p>
          </div>
          <a href="#" className="rounded-lg bg-secondary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors duration-200">
            Schedule Demo 
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;