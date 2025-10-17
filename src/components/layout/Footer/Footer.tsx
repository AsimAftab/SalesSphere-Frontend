import logo from '../../../assets/Image/logo.png';
import googlePlayBadge from '../../../assets/Image/PlayStore.svg';
import appStoreBadge from '../../../assets/Image/AppStore.svg';
import Button from '../../UI/Button/Button';
import { useModal } from '../../../context/ModalContext';
import footerBackground from '../../../assets/Image/Background.svg';

// Data for footer links
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
  const { openDemoModal } = useModal();

  return (
    <footer className="bg-primary relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
        
        {/* --- MODIFIED: Main content wrapper is now a single flex container for alignment --- */}
        <div className="lg:flex lg:gap-8 lg:items-start">
          
          {/* Left Column: Logo & App Links */}
          <div className="relative space-y-8 lg:w-1/3 lg:flex-shrink-0">
            <img
              src={footerBackground}
              alt=""
              className="hidden lg:block absolute inset-0 h-full w-full object-cover z-0 opacity-20"
              aria-hidden="true"
            />
            <div className="relative z-10 space-y-8">
              <a href="#" className="flex items-center -ml-16">
                <img className="h-16 w-auto" src={logo} alt="SalesSphere Logo" />
                <span className="-ml-20 text-3xl font-bold">
                  <span className="text-secondary">Sales</span><span className="text-white">Sphere</span>
                </span>
              </a>
              <p className="text-lg leading-7 text-white">
                Transform your sales operations with
                <br />
                AI-powered insights and real-time tracking.
              </p>
              <div>
                <h3 className="text-xl font-semibold leading-7 text-white">Download Our App</h3>
                <div className="mt-6 flex flex-col items-start space-y-4">
                  <a href="#"><img className="h-14" src={googlePlayBadge} alt="Get it on Google Play" /></a>
                  <a href="#"><img className="h-14" src={appStoreBadge} alt="Download on the App Store" /></a>
                </div>
              </div>
            </div>
          </div>

          {/* --- MODIFIED: Right column now contains BOTH the links and the newsletter section --- */}
          <div className="mt-16 lg:mt-0 lg:w-2/3">
            {/* Link columns */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white mt-14">Product</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.product.map((item) => (
                    <li key={item.name}><a href={item.href} className="text-sm leading-6 text-white hover:text-secondary">{item.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white  mt-14">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.resources.map((item) => (
                    <li key={item.name}><a href={item.href} className="text-sm leading-6 text-white hover:text-secondary">{item.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white  mt-14">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}><a href={item.href} className="text-sm leading-6 text-white hover:text-secondary">{item.name}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white  mt-14">Ready to Boost Your Team's Performance?</h3>
                <div className="mt-6">
                  <Button variant="secondary" onClick={openDemoModal}>
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* --- MODIFIED: Newsletter section is moved here, below the links. --- */}
            <div className="mt-16 border-t border-secondary pt-8">
              <div className="lg:flex lg:items-center lg:justify-between">
                <div className="max-w-md">
                  <h3 className="text-base font-semibold leading-7 text-white">Subscribe to our Newsletter</h3>
                  <p className="mt-2 text-sm leading-7 text-white">Get the latest updates and insights delivered to your inbox.</p>
                </div>
                <form className="mt-6 flex w-full max-w-md items-center gap-x-4 lg:mt-0">
                  <input
                    type="email"
                    required
                    className="min-w-0 flex-auto rounded-lg border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-white focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm"

                    placeholder="Enter your email"
                  />
                 <Button variant="secondary">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* --- MODIFIED: This is now only the final copyright/legal section --- */}
        <div className="mt-8 border-t border-secondary pt-8 md:flex md:items-center md:justify-between">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8 md:order-2">
            <a href="#" className="text-sm leading-6 text-white hover:text-secondary">Terms & Conditions</a>
            <a href="#" className="text-sm leading-6 text-white hover:text-secondary">Privacy Policy</a>
            <a href="#" className="text-sm leading-6 text-white hover:text-secondary">Help</a>
          </div>
          <p className="mt-8 text-xs leading-5 text-white md:order-1 md:mt-0">&copy; 2025 SalesSphere. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


