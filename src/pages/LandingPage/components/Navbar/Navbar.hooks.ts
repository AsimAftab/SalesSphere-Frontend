import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { UseScrollSpyOptions, UseScrollSpyReturn } from './Navbar.types';

/**
 * Custom hook for scroll-aware navbar background
 * Returns true when page is scrolled past threshold
 */
export const useScrollBackground = (threshold = 50): boolean => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Always show background on non-landing pages
    if (location.pathname !== '/') {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, location.pathname]);

  return isScrolled;
};

/**
 * Custom hook for tracking active section based on scroll position
 * Implements Intersection Observer for better performance
 */
export const useScrollSpy = ({
  sectionIds,
  offset = 80,
  rootMargin = 100,
}: UseScrollSpyOptions): UseScrollSpyReturn => {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || '');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if at bottom of page (for last section)
      if (scrollPosition + windowHeight >= documentHeight - 50) {
        setActiveSection(sectionIds[sectionIds.length - 1] || '');
        return;
      }

      // Check if at top
      if (window.scrollY < rootMargin) {
        setActiveSection(sectionIds[0] || '');
        return;
      }

      // Find the current section
      let currentSection = sectionIds[0] || '';

      for (const id of sectionIds) {
        // Treat app showcase as part of About for nav highlighting.
        const sectionElements = id === 'about'
          ? [document.getElementById('about'), document.getElementById('mobile-app')]
          : [document.getElementById(id)];

        for (const element of sectionElements) {
          if (!element) continue;

          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;

          if (scrollPosition >= elementTop - rootMargin && scrollPosition < elementBottom - rootMargin) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    // Initial check after DOM is ready
    const timeoutId = setTimeout(handleScroll, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, sectionIds, offset, rootMargin]);

  return { activeSection };
};

/**
 * Custom hook for mobile menu state management
 */
export const useMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && isOpen) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  return { isOpen, open, close, toggle, menuRef };
};

/**
 * Custom hook for navigation with smooth scroll support
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const smoothScroll = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNavClick = useCallback(
    (id: string, onComplete?: () => void) => {
      if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete before scrolling
        setTimeout(() => {
          smoothScroll(id);
          onComplete?.();
        }, 200);
        return;
      }

      smoothScroll(id);
      onComplete?.();
    },
    [location.pathname, navigate, smoothScroll]
  );

  return { handleNavClick, currentPath: location.pathname };
};
