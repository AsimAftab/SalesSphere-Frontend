// src/components/layout/Footer/Footer.jsx


import logo from '../../../assets/Image/logo.png';
import googlePlayBadge from '../../../assets/Image/PlayStore.svg';
import appStoreBadge from '../../../assets/Image/AppStore.svg';
import Button from '../../UI/Button/Button';
import footerBackground from '../../../assets/Image/Background.svg';


// Data for footer links for easier management
const footerNavigation = {
  product: [
    { name: 'Overview', href: '#' },
    { name: 'Pricing', href: '#' },
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
};

const Footer = () => {
  return (

    <footer className="bg-primary relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className=" mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          
            <div className="relative space-y-1 xl:col-span-1 xl:pt-[4rem]">
              <img
              src={footerBackground}
              alt=""
              className="absolute inset-0 h-full w-full object-cover z-0 opacity-20"
              aria-hidden="true"
              />
              <div className="relative z-10 space-y-8">
                <div className="flex lg:flex-1 -ml-16">
                  <a href="#" className="flex items-center">
                  <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
                    <span className="-ml-20 text-3xl font-bold">
                      <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
                    </span>
                  </a>
                </div>
                <p className="text-lg leading-7 text-white">
                  Transform your sales operations with
                  <br />
                  AI-powered insights and real-time tracking.
                </p>
                {/* App store buttons section */}
                <div>
                  <h3 className=" text-xl leading-7 text-white">Download Our App</h3>
                  <div className="mt-6 flex flex-col items-start space-y-4">
                    <a href="#"><img className="h-14" src={googlePlayBadge} alt="Get it on Google Play" /></a>
                    <a href="#"><img className="h-14" src={appStoreBadge} alt="Download on the App Store" /></a>
                  </div>
                </div>
              </div>
            </div>



          {/* Links structure */}

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0 xl:pt-[5.5rem]">
            <div>
              <h3 className="text-md font-semibold leading-7 text-white">Product</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}><a href={item.href} className="text-sm leading-7 text-white hover:text-secondary">{item.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold leading-7 text-white">Resources</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.resources.map((item) => (
                  <li key={item.name}><a href={item.href} className="text-sm leading-7 text-white hover:text-secondary">{item.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold leading-7 text-white">Company</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}><a href={item.href} className="text-sm leading-7 text-white hover:text-secondary">{item.name}</a></li>
                ))}
              </ul>
            </div>

            {/* "Ready to Boost" CTA section */}
            <div>
              <h3 className="text-lg font-semibold leading-7 text-white">Ready to Boost Your Team's Performance?</h3>
              <div className="mt-6 ">
                <Button variant="secondary">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with newsletter and legal links */}
        
        
          {/* --- THIS IS THE CORRECTED NEWSLETTER SECTION --- */}
                  
        {/* --- CORRECTED NEWSLETTER SECTION --- */}
      <div className="mt-2 grid grid-cols-1 gap-8 items-center xl:grid-cols-3">

        {/* Text content (desktop: col 2) */}
        {/* FIX: Restored xl:col-start-2 */}
        <div className="xl:col-start-2">
          <h3 className="text-lg font-semibold leading-7 text-white">Subscribe to our newsletter</h3>
          <p className="text-md leading-7 text-white">Get the latest updates and insights delivered to your inbox.</p>
        </div>

        {/* Form (desktop: col 3, pushed right) */}
        {/* FIX: Stacks on mobile (flex-col), row on sm+ (sm:flex-row) */}
        {/* FIX: Restored xl:justify-self-end */}
        <form className="flex flex-col sm:flex-row w-full max-w-md items-start gap-4 xl:justify-self-end">
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            type="email"
            autoComplete="email"
            required
            // FIX: w-full sm:flex-auto makes it stack on mobile, flexible on desktop
            className="w-full sm:flex-auto min-w-0 rounded-lg border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white placeholder:text-xl  placeholder:text-center focus:ring-2 focus:ring-inset focus:ring-blue-500 text-lg sm:text-2xl leading-7 text-center sm:text-left"
            placeholder="Enter your email"
          />
          {/* FIX: w-full sm:w-auto makes it stack on mobile */}
          <Button type="submit" variant="secondary" className="w-full sm:w-auto">
            Subscribe
          </Button>
        </form>
      </div>

      {/* --- CORRECTED BOTTOM BAR (LEGAL & COPYRIGHT) --- */}
      {/* Stacks vertically (col-reverse) and centers on mobile */}
      {/* Becomes a row and justifies between on md and up */}
      <div className="mt-10 border-t border-secondary pt-8 flex flex-col-reverse items-center md:flex-row md:justify-between">

        {/* Copyright (stacks on top on mobile, moves to order-1 on md) */}
        <p className="text-sm leading-7 text-white mt-4 md:mt-0 md:order-1">&copy; 2025 SalesSphere. All Rights Reserved.</p>
        
        {/* Links (stacks below on mobile, moves to order-2 on md) */}
        {/* Uses flex-col with space-y-2 on mobile, and flex-row with space-x-6 on md */}
        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-6 md:order-2">
          <a href="#" className="text-sm leading-7 text-white hover:text-secondary">Terms & Conditions</a>
          <a href="#" className="text-sm leading-7 text-white hover:text-secondary">Privacy Policy</a>
          <a href="#" className="text-sm leading-7 text-white hover:text-secondary">Help</a>
        </div>
        
      </div>
      </div>
    </footer>
  );
};

export default Footer;