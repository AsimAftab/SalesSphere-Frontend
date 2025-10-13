import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../UI/Button/Button';
import logo from '../../../assets/Image/logo.png'; // Make sure this path is correct!

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center">
            <img className="h-8 w-auto mr-1" src={logo} alt="SalesSphere Logo" />
            <span className="text-xl font-bold">
              <span className="text-blue-400">Sales</span><span className="text-white">Sphere</span>
            </span>
          </a>
        </div>
        
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

        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-lg font-semibold leading-10 text-white hover:text-blue-400">Products</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white hover:text-blue-400">Features</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white hover:text-blue-400">Pricing</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white hover:text-blue-400">About Us</a>
          <a href="#" className="text-lg font-semibold leading-10 text-white hover:text-blue-400">Contact Us</a>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="secondary" onClick={handleLoginClick}>
            Login <span aria-hidden="true">&rarr;</span>
          </Button>
          <Button variant="secondary">
            Schedule a Demo
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;