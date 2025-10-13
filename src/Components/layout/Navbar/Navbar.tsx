// src/Components/layout/Navbar/Navbar.tsx
import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// --- CHANGE 1: Import the new Button component and your logo ---
import Button from '../../UI/Button/Button';
import logo from '../../../assets/image/logo.png'; // Make sure this path is correct!

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        {/* --- CHANGE 2: Add logo next to the name --- */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center">
            <img className="h-8 w-auto mr-[0.5px]" src={logo} alt="SalesSphere Logo" />
            <span className="text-xl font-bold">
              <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
            </span>
          </a>
        </div>
        
        {/* Mobile Menu Button (No changes here) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Nav Links (No changes here) */}
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-black">Products</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-black">Features</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-black">Pricing</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-black">About Us</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-black">Contact Us</a>
        </div>

        {/* --- CHANGE 3: Use the new Button component --- */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="secondary">
            Login <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button variant="secondary">
            Schedule a Demo
          </Button>
        </div>
      </nav>

      {/* Mobile Menu (No changes here, but could also be updated to use Button component) */}
    </header>
  );
};

export default Navbar;