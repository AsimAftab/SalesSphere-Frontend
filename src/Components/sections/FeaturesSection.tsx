// src/components/sections/FeaturesSection.jsx
import React from 'react';
import { MapPinIcon, ShoppingCartIcon, ShieldCheckIcon, ChartBarIcon, UsersIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'GPS Tracking',
    description: 'Real-time location tracking for sales personnel with automated distance calculation and route mapping.',
    icon: MapPinIcon,
  },
  {
    name: 'Order Management',
    description: 'Empower your sales team to create orders, browse the product catalogue, and manage pricing on the go.',
    icon: ShoppingCartIcon,
  },
  {
    name: 'Smart Attendance',
    description: 'Automated check-in/check-out system with GPS verification and attendance reports.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Comprehensive insights into sales performance, territory visibility, and revenue trends.',
    icon: ChartBarIcon,
  },
  {
    name: 'Role-Based Access',
    description: 'Secure access control for Admin, Managers, Sales Account, and Soap roles.',
    icon: UsersIcon,
  },
  {
    name: 'Stock Management',
    description: 'Efficiently track inventory levels and manage stock reconciliation with real-time stock updates.',
    icon: ArchiveBoxIcon,
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-400">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
             Everything you need to boost your sales
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16 bg-primary p-8 rounded-lg">
                <dt className="text-base font-semibold leading-7 text-white">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-300">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;