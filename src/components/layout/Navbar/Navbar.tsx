import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../UI/Button/Button';
import { useModal } from '../../modals/DemoModalContext'; // <-- IMPORT THE HOOK
import logo from '../../../assets/Image/Logo-c.svg';


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
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

  // Scroll spy: Track which section is currently in view
  useEffect(() => {
    // Only run on homepage
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is in the middle of viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        } else if (entry.target.id === activeSection) {
          // If the currently active section is leaving the viewport, check if we should reset
          const featuresSection = document.getElementById('features');
          if (featuresSection) {
            const rect = featuresSection.getBoundingClientRect();
            // If features section is below the viewport, we're in the hero section
            if (rect.top > window.innerHeight * 0.3) {
              setActiveSection('');
            }
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = ['features', 'About'];
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    // Also handle scroll events to detect when at the top
    const handleScroll = () => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        // If we're scrolled above the features section, clear active state
        if (rect.top > window.innerHeight * 0.3) {
          setActiveSection('');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, activeSection]);

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-primary h-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8 h-full" aria-label="Global">
        
        {/* Logo */}
        <div className="flex lg:flex-1 ">
          <a href="#" className="flex items-center">
            <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
            <span className=" ml-2 text-3xl font-bold">
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
          {/*<a href="#" className="text-md font-semibold leading-6 text-white hover:text-secondary">Products</a>*/}
          <a
            onClick={() => handleNavLinkClick('features')}
            className={`text-md font-semibold leading-6 cursor-pointer transition-colors duration-200 ${
              activeSection === 'features'
                ? 'text-secondary'
                : 'text-white hover:text-secondary'
            }`}
          >
            Features
          </a>
          {/*<a href="#" className="text-md font-semibold leading-6 text-white hover:text-secondary">Pricing</a>*/}
          <a
            onClick={() => handleNavLinkClick('About')}
            className={`text-md font-semibold leading-6 cursor-pointer transition-colors duration-200 ${
              activeSection === 'About'
                ? 'text-secondary'
                : 'text-white hover:text-secondary'
            }`}
          >
            About Us
          </a>
          <a href="#" className="text-md font-semibold leading-6 text-white hover:text-secondary transition-colors duration-200">Contact Us</a>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
          <Button variant="secondary" onClick={handleLoginClick}>
            <span className="inline-flex items-center gap-x-2">
              Login
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
              <a href="#" className="flex items-center">
                <img className="h-12 w-auto" src={logo} alt="SalesSphere Logo" />
                <span className="ml-2 text-3xl font-bold">
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

                  {/* UPDATED: onClick for Features, hover color
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary-dark">Products</a>
                    <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary-dark">Pricing</a>
                  */}
                  <a
                    onClick={() => handleNavLinkClick('features')}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 cursor-pointer transition-colors duration-200 ${
                      activeSection === 'features'
                        ? 'text-secondary bg-secondary/10'
                        : 'text-white hover:bg-secondary/20'
                    }`}
                  >
                    Features
                  </a>

                  {/* UPDATED: onClick for About Us, hover color */}
                  <a
                    onClick={() => handleNavLinkClick('About')}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 cursor-pointer transition-colors duration-200 ${
                      activeSection === 'About'
                        ? 'text-secondary bg-secondary/10'
                        : 'text-white hover:bg-secondary/20'
                    }`}
                  >
                    About Us
                  </a>
                  <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-secondary/20 transition-colors duration-200">Contact Us</a>
                </div>
                {/* Mobile Buttons */}
                <div className="py-6 flex items-center gap-x-4">
                  {/* FIX 2: Removed w-full and justify-center classes from buttons */}
                  <Button variant="secondary" onClick={handleLoginClick}>
                    <span className="flex items-center gap-x-2">
                      Login
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