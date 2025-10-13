// src/components/layout/Footer/Footer.jsx

import logo from '../../../assets/Image/logo.png';
import googlePlayBadge from '../../../assets/Image/PlayStore.png';
import appStoreBadge from '../../../assets/Image/AppStore.png';
import Button from '../../UI/Button/Button';

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
    <footer className="bg-primary" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="px-6 pb-8 pt-16 sm:pt-24 lg:px-8">
        {/* Top section with logo, links, and CTA */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Logo, description, and app store buttons */}
          <div className="space-y-8 xl:col-span-1">

            {/* --- THIS IS THE CORRECTED LOGO SECTION --- */}
            <div className="-ml-16"> 
            <div className="flex items-center">
              <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
              <span className=" text-5xl font-bold ml-[-70px]">
                <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
              </span>
            </div>
            </div>

            <p className="text-2xl leading-7 text-white">
              Transform your sales operations with
              <br />
              AI-powered insights and real-time tracking.
            </p>

            {/* App store buttons section */}
            <div>
              <h3 className="text-2xl leading-7 text-white">Download Our App</h3>
              <div className="mt-10 flex flex-col items-start space-y-4">
                <a href="#"><img className="h-16" src={googlePlayBadge} alt="Get it on Google Play" /></a>
                <a href="#"><img className="h-16" src={appStoreBadge} alt="Download on the App Store" /></a>
              </div>
            </div>
          </div>

          {/* Links structure */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2 xl:mt-0 xl:pt-[5.5rem]">
            <div>
              <h3 className="text-2xl font-semibold leading-7 text-white">Product</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}><a href={item.href} className="text-2xl leading-7 text-white hover:text-secondary">{item.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold leading-7 text-white">Resources</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.resources.map((item) => (
                  <li key={item.name}><a href={item.href} className="text-2xl leading-7 text-white hover:text-secondary">{item.name}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold leading-7 text-white">Company</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}><a href={item.href} className="text-2xl leading-7 text-white hover:text-secondary">{item.name}</a></li>
                ))}
              </ul>
            </div>

            {/* "Ready to Boost" CTA section */}
            <div>
              <h3 className="text-2xl font-semibold leading-7 text-white">Ready to Boost Your Team's Performance?</h3>
              <div className="mt-6">
                <Button variant="secondary">
                  Get Demo
                  <span aria-hidden="true" className="ml-1">&rarr;</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with newsletter and legal links */}
        
        
          {/* --- THIS IS THE CORRECTED NEWSLETTER SECTION --- */}
        <div className="grid grid-cols-1 gap-8 items-center xl:grid-cols-3">
          {/* Text content takes the first column */}
           <div className="xl:col-start-2">
            <h3 className="text-2xl font-semibold leading-7">Subscribe to our newsletter</h3>
            <p className="text-2xl leading-7 text-white">Get the latest updates and insights delivered to your inbox.</p>
          </div>

          {/* Form takes the second and third columns, and is pushed to the right */}
          <form className="flex w-full max-w-md items-start gap-x-4">
            <input
              type="email"
              required
              className="min-w-0 flex-auto rounded-lg border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-blue-500 text-2xl leading-7 text-center"
              placeholder="Enter your email"
            />
            {/* Using the reusable Button component */}
          <Button type="submit" variant="secondary">
            Subscribe
          </Button>
          </form>
        </div>
          <div className="mt-10 border-t border-secondary pt-10 md:flex md:items-center md:justify-between">
            <div className="flex space-x-32 md:order-1">
              <a href="#" className="text-2xl leading-7 text-white hover:text-secondary">Terms & Conditions</a>
              <a href="#" className="text-2xl leading-7 text-white hover:text-secondary">Privacy Policy</a>
              <a href="#" className="text-2xl leading-7 text-white hover:text-secondary">Help</a>
            </div>
            <p className="mt-8 text-2xl leading-7 text-white  md:order-2 md:mt-0">&copy; 2025 SalesSphere. All Rights Reserved.</p>
          </div>
        
      </div>
    </footer>
  );
};

export default Footer;