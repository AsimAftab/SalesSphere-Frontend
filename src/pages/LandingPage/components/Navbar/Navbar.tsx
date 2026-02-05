import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/components/ui/utils';
import logo from '@/assets/images/logo-c.svg';
import type {
  NavbarProps,
  NavLinkProps,
  NavLogoProps,
  MobileMenuProps,
} from './Navbar.types';
import { useScrollSpy, useMobileMenu, useNavigation, useScrollBackground } from './Navbar.hooks';

// Animation variants
const menuOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const menuPanelVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 200,
    },
  },
  exit: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 200,
    },
  },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

/**
 * NavLogo - Renders the brand logo and name
 */
const NavLogo = memo<NavLogoProps>(({ logo: customLogo, brandName, onClick }) => (
  <a
    href="/"
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick();
      }
    }}
    className="flex items-center lg:flex-1"
    aria-label="Go to homepage"
  >
    {customLogo || (
      <img
        className="h-12 w-auto"
        src={logo}
        alt="SalesSphere logo"
        width={48}
        height={48}
      />
    )}
    {brandName && (
      <span className="ml-2 text-2xl sm:text-3xl font-bold select-none">
        <span className="text-[#197ADC]">{brandName.primary}</span>
        <span className="text-white">{brandName.secondary}</span>
      </span>
    )}
  </a>
));

NavLogo.displayName = 'NavLogo';

/**
 * NavLink - Individual navigation link with active state
 */
const NavLink = memo<NavLinkProps>(({ item, isActive, onClick, isMobile = false }) => (
  <motion.a
    href={item.href || `#${item.id}`}
    onClick={(e) => {
      if (!item.isExternal) {
        e.preventDefault();
        onClick(item.id);
      }
    }}
    className={cn(
      'text-md font-semibold transition-colors duration-200 cursor-pointer',
      isActive ? 'text-secondary' : 'text-white hover:text-secondary',
      isMobile && 'block py-3 px-4 rounded-lg hover:bg-white/10'
    )}
    whileHover={{ scale: isMobile ? 1 : 1.05 }}
    whileTap={{ scale: 0.95 }}
    target={item.isExternal ? '_blank' : undefined}
    rel={item.isExternal ? 'noopener noreferrer' : undefined}
    aria-current={isActive ? 'page' : undefined}
  >
    {item.label}
  </motion.a>
));

NavLink.displayName = 'NavLink';

/**
 * MobileMenu - Animated mobile navigation drawer
 */
const MobileMenu = memo<MobileMenuProps>(
  ({ isOpen, onClose, navItems, activeSection, onNavClick, logo: customLogo, brandName, ctaButton, secondaryCta }) => (
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            variants={menuOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <motion.div
            variants={menuPanelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 w-full sm:max-w-sm bg-primary px-6 py-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <NavLogo logo={customLogo} brandName={brandName} onClick={onClose} />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
                onClick={onClose}
                className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </div>

            {/* Navigation Links */}
            <nav className="mt-8" aria-label="Mobile navigation">
              <ul className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.li
                    key={item.id}
                    custom={index}
                    variants={menuItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <NavLink
                      item={item}
                      isActive={activeSection === item.id}
                      onClick={(id) => {
                        onNavClick(id);
                        onClose();
                      }}
                      isMobile
                    />
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* CTA Buttons */}
            {(secondaryCta || ctaButton) && (
              <motion.div
                className="mt-8 px-4 flex flex-col gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {secondaryCta && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onClose();
                      secondaryCta.onClick();
                    }}
                    aria-label={secondaryCta.ariaLabel}
                    className="w-full border-2 border-white/70 !text-white !bg-transparent hover:!bg-white/10"
                  >
                    {secondaryCta.label}
                  </Button>
                )}
                {ctaButton && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      onClose();
                      ctaButton.onClick();
                    }}
                    aria-label={ctaButton.ariaLabel}
                    className="w-full"
                  >
                    {ctaButton.label}
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
);

MobileMenu.displayName = 'MobileMenu';

/**
 * Navbar - Enterprise-grade navigation component
 *
 * Follows SOLID principles:
 * - SRP: Sub-components handle specific responsibilities
 * - OCP: Extensible via props (navItems, ctaButton, logo)
 * - ISP: Granular interfaces for different components
 * - DIP: Uses custom hooks for navigation logic abstraction
 */
const Navbar = memo<NavbarProps>(
  ({
    logo: customLogo,
    brandName = { primary: 'Sales', secondary: 'Sphere' },
    navItems,
    ctaButton,
    secondaryCta,
    className,
  }) => {
    const sectionIds = useMemo(() => navItems.map((item) => item.id), [navItems]);
    const { activeSection } = useScrollSpy({ sectionIds });
    const { isOpen, open, close, menuRef } = useMobileMenu();
    const { handleNavClick } = useNavigation();
    const isScrolled = useScrollBackground(50);

    const getButtonClasses = (variant?: 'primary' | 'secondary' | 'outline') => {
      const baseClasses = 'px-5 py-2.5 text-sm';
      switch (variant) {
        case 'outline':
          return `${baseClasses} border-2 border-white/70 text-white hover:bg-white/10 hover:border-white bg-transparent`;
        case 'primary':
          return `${baseClasses} bg-secondary text-white hover:bg-secondary/90 shadow-md shadow-secondary/25`;
        default:
          return baseClasses;
      }
    };

    return (
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          isScrolled ? 'bg-primary shadow-lg' : 'bg-transparent',
          className
        )}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8 h-full"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <NavLogo
            logo={customLogo}
            brandName={brandName}
            onClick={() => handleNavClick(sectionIds[0] || 'top')}
          />

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="lg:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={open}
          >
            <Menu className="h-6 w-6" />
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-10" role="navigation" aria-label="Desktop navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                onClick={handleNavClick}
              />
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-3">
            {secondaryCta && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  onClick={secondaryCta.onClick}
                  aria-label={secondaryCta.ariaLabel}
                  className={getButtonClasses(secondaryCta.variant)}
                >
                  {secondaryCta.label}
                </Button>
              </motion.div>
            )}
            {ctaButton && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="secondary"
                  onClick={ctaButton.onClick}
                  aria-label={ctaButton.ariaLabel}
                  className={getButtonClasses(ctaButton.variant)}
                >
                  {ctaButton.label}
                </Button>
              </motion.div>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div ref={menuRef} id="mobile-menu">
          <MobileMenu
            isOpen={isOpen}
            onClose={close}
            navItems={navItems}
            activeSection={activeSection}
            onNavClick={handleNavClick}
            logo={customLogo}
            brandName={brandName}
            ctaButton={ctaButton}
            secondaryCta={secondaryCta}
          />
        </div>
      </header>
    );
  }
);

Navbar.displayName = 'Navbar';

export default Navbar;
