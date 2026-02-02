// src/components/layout/Navbar/Navbar.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../../ui/Button/Button";
import logo from "../../../assets/images/logo-c.svg";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleNavClick = (id: string) => {
    setIsOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => smoothScroll(id), 200);
      return;
    }

    smoothScroll(id);
  };

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["top", "features", "About", "footer"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;

          // Footer needs 60% visibility to become active
          if (id === "footer") {
            if (entry.intersectionRatio >= 0.6) {
              setActiveSection("footer");
            }
            return;
          }

          // Other sections activate on 25% visibility
          if (entry.intersectionRatio >= 0.25) {
            setActiveSection(id);
          }
        });
      },
      {
        threshold: [0.1, 0.25, 0.6],
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const navLink = (label: string, id: string) => (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        handleNavClick(id);
      }}
      className={`text-md font-semibold transition-colors duration-200 cursor-pointer ${
        activeSection === id
          ? "text-secondary"
          : "text-white hover:text-secondary"
      }`}
    >
      {label}
    </a>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-primary">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8 h-full"
        aria-label="Main Navigation"
      >
        {/* LOGO */}
        <a href="/" className="flex items-center lg:flex-1">
          <img className="h-12 w-auto" src={logo} alt="SalesSphere logo" width={48} height={48} />
          <span className="ml-2 text-3xl font-bold select-none">
            <span className="text-secondary">Sales</span>
            <span className="text-white">Sphere</span>
          </span>
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label="Open menu"
          className="lg:hidden text-white p-2"
          onClick={() => setIsOpen(true)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navLink("Home", "top")}
          {navLink("Features", "features")}
          {navLink("About Us", "About")}
          {navLink("Contact Us", "footer")}
        </div>

        {/* DESKTOP LOGIN BUTTON */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="fixed inset-y-0 right-0 w-full sm:max-w-sm bg-primary px-6 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center">
                <img className="h-12 w-auto" src={logo} alt="SalesSphere logo" width={48} height={48} />
                <span className="ml-2 text-3xl font-bold">
                  <span className="text-secondary">Sales</span>
                  <span className="text-white">Sphere</span>
                </span>
              </a>

              <button
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="p-2 text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {navLink("Home", "top")}
              {navLink("Features", "features")}
              {navLink("About Us", "About")}
              {navLink("Contact Us", "footer")}
            </div>

            <div className="mt-6">
              <Button variant="secondary" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
