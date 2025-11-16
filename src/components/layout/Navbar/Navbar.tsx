import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../../UI/Button/Button';
import logo from '../../../assets/Image/Logo-c.svg';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNavLinkClick = (sectionId: string) => {
    setIsOpen(false); 
    navigate('/'); 
    setTimeout(() => {
      if (sectionId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); 
  };

  
  useEffect(() => {
   
    if (location.pathname !== '/') {
      setActiveSection('none'); // Set to a non-matching string
      return;
    }

    // 2. Observer for highlighting sections (Features, About)
    const sectionObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Triggers in the middle of the screen
      threshold: 0,
    };

    const sectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const sectionObserver = new IntersectionObserver(sectionObserverCallback, sectionObserverOptions);
    const sections = ['features', 'About']; // Make sure 'features' and 'About' are the IDs of your sections
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // 3. Observer for highlighting "Home" (when scrolling to top)
    const heroObserverOptions = {
      root: null,
      rootMargin: '0px 0px -30% 0px', // Triggers when 'features' section top is 30% from top
      threshold: 0,
    };

    const heroObserverCallback = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry.isIntersecting && entry.boundingClientRect.top > window.innerHeight * 0.3) {
        setActiveSection(''); // Set to empty string for "Home"
      }
    };

    const heroObserver = new IntersectionObserver(heroObserverCallback, heroObserverOptions);
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      heroObserver.observe(featuresSection);
    }

    // 4. Cleanup function
    return () => {
      sectionObserver.disconnect();
      heroObserver.disconnect();
    };
  }, [location.pathname]); // 5. ONLY re-run when the page path changes

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
          {/* --- FIXED: activeSection check is now '' --- */}
          <a
            onClick={() => handleNavLinkClick('top')}
            className={`text-md font-semibold leading-6 cursor-pointer transition-colors duration-200 ${
              activeSection === 'none' 
                ? 'text-secondary'
                : 'text-white hover:text-secondary'
            }`}
          >
            Home
          </a>
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
          <a
          onClick={() => handleNavLinkClick('About')}
            className={`text-md font-semibold leading-6 cursor-pointer transition-colors duration-200 ${
            activeSection === 'About'
              ? 'text-secondary bg-secondary/10'
              : 'text-white hover:bg-secondary/20'
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
          {/* "Schedule a Demo" Button REMOVED */}
        </div>
      </nav>

      {/* --- MOBILE MENU PANEL --- */}
      {isOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50" />
          
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
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
                  {/* --- FIXED: activeSection check is now '' --- */}
                  <a
                    onClick={() => handleNavLinkClick('top')}
                    className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 cursor-pointer transition-colors duration-200 ${
                      activeSection === 'none'
                        ? 'text-secondary bg-secondary/10'
                        : 'text-white hover:bg-secondary/20'
                    }`}
                  >
                    Home
                  </a>
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
                  <Button variant="secondary" onClick={handleLoginClick}>
                    <span className="flex items-center gap-x-2">
                      Login
                    </span>
                  </Button>
                  {/* "Schedule a Demo" Button REMOVED */}
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