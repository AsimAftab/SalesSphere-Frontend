// src/components/sections/WhyChooseSection.jsx
import React from 'react';
import strokeImage from '../../assets/Image/stroke.svg'; // Make sure this path is correct!
import Button from '../../Components/UI/Button/Button';

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
  return (
    <section id="About" className="bg-gray-100 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Why Choose{' '}
            {/* --- THIS IS THE CORRECTED SECTION --- */}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">
                <span className="text-secondary">Sales</span>Sphere
              </span>
              <img 
                src={strokeImage} 
                alt="Underline" 
                className="absolute -bottom-2 left-0 w-full h-auto z-0" 
                aria-hidden="true" 
              />
              
            </span>
          </h2>
          <p className="mt-4 text-lg leading-8 text-black">
            Transform your field sales operations with our comprehensive platform 
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.number} className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                <span className="text-xl font-bold text-white">{feature.number}</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold leading-7 text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-lg leading-7 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* --- FIX 2: CTA Banner styled to perfectly match the Figma design --- */}
        <div className="mt-20 mx-auto max-w-lg flex flex-col items-center justify-between gap-6 p-6 sm:flex-row sm:px-8 sm:py-6 rounded-xl bg-white shadow-xl">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-gray-900">Ready to transform your sales?</h3>
            <p className="mt-1 text-black">Schedule the demo today</p>
          </div>
          {/* --- USING YOUR BUTTON COMPONENT --- */}
          <Button variant="secondary">
            Schedule Demo 
          </Button>
        </div>
      </div>
    </section>
  );
};
export default WhyChooseSection;