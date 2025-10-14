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
              <div className="mt-6">
                <Button variant="secondary">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section with newsletter and legal links */}
        
        
          {/* --- THIS IS THE CORRECTED NEWSLETTER SECTION --- */}
                  
        <div className="grid grid-cols-1 gap-8 items-center xl:grid-cols-3 -mt-12">

          {/* Text content takes the first column */}
           <div className="xl:col-start-2">

            <h3 className="text-lg font-semibold leading-7 text-white">Subscribe to our newsletter</h3>

            <p className="text-md leading-7 text-white">Get the latest updates and insights delivered to your inbox.</p>

          </div>

          {/* Form takes the second and third columns, and is pushed to the right */}
          <form className="flex w-full max-w-md items-start gap-x-4">
            <input
              type="email"
              required
              className="min-w-0 flex-auto rounded-lg border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-blue-500 text-2xl leading-7 text-center"
              placeholder="Enter your email"
            />
            <Button type="submit" variant="secondary">
             Subscribe
            </Button>
          </form>
        </div>

          <div className="border-t border-secondary pt-2 md:flex md:items-center md:justify-between">

            <div className="flex space-x-32 md:order-1">
              <a href="#" className="text-sm leading-7 text-white hover:text-secondary">Terms & Conditions</a>
              <a href="#" className="text-sm leading-7 text-white hover:text-secondary">Privacy Policy</a>
              <a href="#" className="text-sm leading-7 text-white hover:text-secondary">Help</a>
            </div>

            <p className="text-sm leading-7 text-white  md:order-2 md:mt-0">&copy; 2025 SalesSphere. All Rights Reserved.</p>

          </div>
      </div>
    </footer>
  );
};

export default Footer;