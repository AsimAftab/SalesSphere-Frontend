import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../UI/Button/Button'; 
import { useModal } from '../../../context/ModalContext'; // <-- IMPORT THE HOOK
import logo from '../../../assets/Image/logo.png';
import loginArrow from '../../../assets/Image/login.svg';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { openDemoModal } = useModal(); // <-- USE THE HOOK TO GET THE FUNCTION

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNavLinkClick = (sectionId: string) => {
    setIsOpen(false); // Close mobile menu if open
    navigate('/'); // Navigate to homepage first
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Small delay to allow page to render
  };


  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-primary h-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8 h-full" aria-label="Global">
        
        {/* Logo */}
        <div className="flex lg:flex-1 -ml-16">
          <a href="#" className="flex items-center">
            <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className="-ml-20 text-3xl font-bold">
              <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
            </span>
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Desktop Menu Links */}
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-md font-semibold leading-6 text-white hover:text-secondary">Products</a>
          <a href="#features" className="text-md font-semibold leading-6 text-white hover:text-secondary">Features</a>
          <a href="#" className="text-md font-semibold leading-6 text-white hover:text-secondary">Pricing</a>
          <a href="#About" className="text-md font-semibold leading-6 text-white hover:text-secondary">About Us</a>
          <a href="#" className="text-md font-semibold leading-6 text-white hover:text-secondary">Contact Us</a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
          <Button variant="secondary" onClick={handleLoginClick}>
            <span className="flex items-center gap-x-2">
                Login
                <img src={loginArrow} alt="" className="h-4 w-4" aria-hidden="true" />
            </span>
          </Button>
          <Button variant="primary" onClick={openDemoModal}> {/* <-- OPEN THE MODAL ON CLICK */}
            Schedule a Demo
          </Button>
        </div>
      </nav>

      {/* --- MOBILE MENU PANEL --- */}
      {isOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50" />
          
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              {/* FIX 1: Replaced small logo with full logo */}
              <a href="#" className="flex items-center -ml-16">
                <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
                <span className="-ml-20 text-3xl font-bold">
                  <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
                </span>
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-secondary">
                {/* Mobile Links */}
                <div className="space-y-2 py-6">
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary-dark">Products</a>
                  {/* UPDATED: onClick for Features, hover color */}
                  <a onClick={() => handleNavLinkClick('features')} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary-dark cursor-pointer">Features</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary-dark">Pricing</a>
                  {/* UPDATED: onClick for About Us, hover color */}
                  <a onClick={() => handleNavLinkClick('About')} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary-dark cursor-pointer">About Us</a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary-dark">Contact Us</a>
                </div>
                {/* Mobile Buttons */}
                <div className="py-6 flex items-center gap-x-4">
                  {/* FIX 2: Removed w-full and justify-center classes from buttons */}
                  <Button variant="secondary" onClick={handleLoginClick}>
                    <span className="flex items-center gap-x-2">
                      Login
                      <img src={loginArrow} alt="" className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Button>
                  <Button variant="secondary" onClick={openDemoModal}> {/* <-- OPEN THE MODAL ON CLICK */}
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;