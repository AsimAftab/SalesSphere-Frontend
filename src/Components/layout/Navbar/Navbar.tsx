// src/Components/layout/Navbar/Navbar.tsx
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../UI/Button/Button';
<<<<<<< Updated upstream
import logo from '../../../assets/image/logo.png'; 
=======
import logo from '../../../assets/Image/logo.png';
import loginArrow from '../../../assets/Image/login.svg';
>>>>>>> Stashed changes

// DEFINE PROP INTERFACE 
interface NavbarProps {
    onLoginClick: () => void;
}
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 z-50 w-full   bg-primary">
      {/* --- CHANGE 1: Removed 'items-center' from this nav tag --- */}
      <nav className="mx-auto flex max-w-7xl justify-between px-2 lg:px-8" aria-label="Global">
        
        {/* Logo (Kept at your desired large size) */}
        <div className="flex lg:flex-1 -ml-16">
          <a href="#" className="flex items-center">
            <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className="-ml-20 text-3xl font-bold">
              <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
            </span>
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

<<<<<<< Updated upstream
        {/* Desktop Nav Links (No changes here) */}
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-secondary">Products</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-secondary">Features</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-secondary">Pricing</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-secondary">About Us</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white-300 hover:text-secondary">Contact Us</a>
        </div>

        {/* --- CHANGE 3: Use the new Button component --- */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="secondary">
            Login <span aria-hidden="true">&rarr;</span>
=======
        {/* --- CHANGE 2: Added 'items-center' to this container --- */}
        <div className="hidden lg:flex lg:gap-x-12 items-center">
          <a href="#"         className="text-md font-semibold leading-6 text-white hover:text-secondary">Products</a>
          <a href="#features" className="text-md font-semibold leading-6 text-white hover:text-secondary">Features</a>
          <a href="#"         className="text-md font-semibold leading-6 text-white hover:text-secondary">Pricing</a>
          <a href="#About"    className="text-md font-semibold leading-6 text-white hover:text-secondary">About Us</a>
          <a href="#"         className="text-md font-semibold leading-6 text-white hover:text-secondary">Contact Us</a>
        </div>

        {/* --- CHANGE 3: Added 'items-center' to this container --- */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6 items-center">
          <Button variant="secondary" onClick={handleLoginClick}>
            <span className="flex items-center gap-x-2">
                Login
                <img src={loginArrow} alt="" className="h-4 w-4" aria-hidden="true" />
            </span>
>>>>>>> Stashed changes
          </Button>
          <Button variant="primary">
            Schedule a Demo
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;