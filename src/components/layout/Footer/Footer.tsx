// src/components/layout/Footer/Footer.jsx

import logo from '@/assets/images/logo-c.svg';
import googlePlayBadge from '@/assets/images/play-store.svg';
import appStoreBadge from '@/assets/images/app-store.svg';
import { useModal } from '../../modals/DemoModalContext';
import { useContactUsModal } from '../../modals/ContactUsModalContext';
import { Button } from '@/components/ui';

// Data for footer links for easier management
const footerNavigation = {
  product: [
    { name: 'Overview', href: '/#features' },
    { name: 'Pricing', href: '/#footer' },
    { name: 'Customer stories', href: '/#About' },
  ],
  resources: [
    { name: 'Blog', href: '/#footer' },
    { name: 'Guides & tutorials', href: '/#footer' },
    { name: 'Help center', href: '/#footer' },
  ],
  company: [
    { name: 'About us', href: '/about-us' },
    { name: 'Contact Us', action: 'openContactUsModal' },
  ],
};

const Footer = () => {
  const { openDemoModal } = useModal();
  const { openContactUsModal } = useContactUsModal();


  return (
   <footer id='footer' className="bg-primary relative overflow-hidden py-12 lg:py-16" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:gap-12 xl:grid-cols-3">

          {/* Left Column: Logo, Description, App Downloads */}
            <div className="space-y-6 xl:col-span-1">
              <div className="space-y-6">
                {/* Logo */}
                <div className="flex lg:flex-1">
                  <a href="/" className="flex items-center">
                  <img className="h-10 w-auto sm:h-12" src={logo} alt="SalesSphere Logo" width={48} height={48} />
                    <span className="ml-2 text-2xl sm:text-3xl font-bold">
                      <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
                    </span>
                  </a>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg leading-6 sm:leading-7 text-white/90">
                  Transform your sales operations with
                  <br />
                  AI-powered insights and real-time tracking.
                </p>

                {/* App store buttons section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold leading-6 text-white mb-4">Download Our App</h3>
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Get it on Google Play">
                      <img className="h-12 sm:h-14" src={googlePlayBadge} alt="Get it on Google Play" width={168} height={56} />
                    </a>
                    <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Download on the App Store">
                      <img className="h-12 sm:h-14" src={appStoreBadge} alt="Download on the App Store" width={168} height={56} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          {/* Right Columns: Links + CTA */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 xl:col-span-2">
            {/* Product Links */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold leading-6 text-white">Product</h3>
              <ul role="list" className="mt-4 sm:mt-6 space-y-3">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-xs sm:text-sm leading-6 text-white/90 hover:text-secondary transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold leading-6 text-white">Resources</h3>
              <ul role="list" className="mt-4 sm:mt-6 space-y-3">
                {footerNavigation.resources.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-xs sm:text-sm leading-6 text-white/90 hover:text-secondary transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-sm sm:text-base font-semibold leading-6 text-white">Company</h3>
               <ul role="list" className="mt-4 sm:mt-6 space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href || '#'} // Fallback to '#' if href is not defined
                      onClick={(e) => {
                        if (item.action === 'openContactUsModal') {
                          e.preventDefault(); // Prevent default navigation for modal
                          openContactUsModal();
                        }
                      }}
                      className="text-xs sm:text-sm leading-6 text-white/90 hover:text-secondary transition-colors"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Section */}
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm sm:text-base font-semibold leading-6 text-white">Ready to Boost Your Team's Performance?</h3>
              <div className="mt-4 sm:mt-6">
                <Button variant="secondary" onClick={openDemoModal} className="w-full sm:w-auto">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section - Reduced spacing */}
      <div className="mt-8 lg:mt-12 grid grid-cols-1 gap-6 lg:gap-8 items-start lg:items-center xl:grid-cols-3">

        {/* Newsletter Text */}
        <div className="xl:col-start-2">
          <h3 className="text-base sm:text-lg font-semibold leading-6 text-white">Subscribe to our newsletter</h3>
          <p className="mt-1 text-sm sm:text-base leading-6 text-white/90">Get the latest updates and insights delivered to your inbox.</p>
        </div>

        {/* Newsletter Form */}
        <form className="flex flex-col sm:flex-row w-full max-w-md items-start gap-3 sm:gap-4 xl:justify-self-end">
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <input
            id="email-address"
            type="email"
            autoComplete="email"
            required
            className="w-full sm:flex-auto min-w-0 rounded-lg border-0 bg-white/5 px-3.5 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
            placeholder="Enter your email"
          />
          <Button type="submit" variant="secondary" className="w-full sm:w-auto shrink-0">
           Subscribe
          </Button>
        </form>
      </div>

      {/* Bottom Bar - Copyright & Legal */}
     <div className="mt-8 lg:mt-12 border-t border-white/10 pt-6 lg:pt-8 flex flex-col-reverse items-center gap-4 md:flex-row md:justify-between">
        {/* Copyright */}
        <p className="text-xs sm:text-sm leading-5 text-white/90 text-center md:text-left">
          &copy; 2025 SalesSphere. All Rights Reserved.
        </p>

        {/* Legal Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:gap-x-6">
         <a href="/terms-and-conditions" className="text-xs sm:text-sm leading-5 text-white/90 hover:text-secondary transition-colors">
           Terms & Conditions
         </a>
          <a href="/privacy-policy" className="text-xs sm:text-sm leading-5 text-white/90 hover:text-secondary transition-colors">
            Privacy Policy
          </a>
          <a href="/#footer" className="text-xs sm:text-sm leading-5 text-white/90 hover:text-secondary transition-colors">
            Help
          </a>
        </div>

      </div>
      </div>
    </footer>
  );
};

export default Footer;
