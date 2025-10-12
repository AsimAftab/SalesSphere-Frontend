// src/components/layout/Footer/Footer.jsx

import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

// --- REMOVED: Image imports for app store badges ---
import logo from '../../../assets/Image/logo.png'; // Still need your main logo

// Data for footer links for easier management
const footerNavigation = {
  product: [
    { name: 'Overview', href: '#' },
    { name: 'Pricing', 'href': '#' },
    { name: 'Customer stories', href: '#' },
  ],
  resources: [
    { name: 'Blog', href: '#' },
    { name: 'Guides & tutorials', href: '#' },
    { name: 'Help center', href: '#' },
  ],
  company: [
    { name: 'About us', href: '#' },
    { name: 'Contact Us', href: '#' },
  ],
  legal: [
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy Policy', href: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and primary text section */}
          <div className="space-y-8">
            <a href="#" className="flex items-center gap-x-3">
              <img className="h-7 w-auto" src={logo} alt="SalesSphere Logo" />
              <span className="text-2xl font-bold">
                <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
              </span>
            </a>
            <p className="text-sm leading-6 text-gray-300">
              Transform your field sales operations with AI-powered insights and real-time tracking.
            </p>
            {/* --- REMOVED: App Store buttons div --- */}
          </div>

          {/* Links section */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.product.map((item) => (
                    <li key={item.name}><a href={item.href} className="text-sm leading-6 hover:text-white">{item.name}</a></li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.resources.map((item) => (
                    <li key={item.name}><a href={item.href} className="text-sm leading-6 hover:text-white">{item.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}><a href={item.href} className="text-sm leading-6 hover:text-white">{item.name}</a></li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                 <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}><a href={item.href} className="text-sm leading-6 hover:text-white">{item.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter and Bottom bar */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <div className="lg:flex lg:items-center lg:justify-between">
             <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Subscribe to our newsletter</h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">The latest updates and insights delivered to your inbox.</p>
             </div>
             <form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
                <input type="email" required className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:w-64 sm:text-sm sm:leading-6" placeholder="Enter your email" />
                <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
                   <button type="submit" className="flex w-full items-center justify-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80">Subscribe</button>
                </div>
             </form>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
                <a href="#" className="text-gray-400 hover:text-white"><FaFacebook className="h-6 w-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaTwitter className="h-6 w-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaLinkedin className="h-6 w-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white"><FaInstagram className="h-6 w-6" /></a>
            </div>
            <p className="mt-8 text-xs leading-5 md:order-1 md:mt-0">&copy; 2025 SalesSphere. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;