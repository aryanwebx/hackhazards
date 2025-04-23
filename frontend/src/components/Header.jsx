import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">SafeNet</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" current={location.pathname === '/'} />
            <NavLink to="/about" label="About" current={location.pathname === '/about'} />
            <NavLink to="/history" label="History" current={location.pathname === '/history'} />
            <NavLink to="/contact" label="Contact" current={location.pathname === '/contact'} />
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            <MobileNavLink to="/" label="Home" current={location.pathname === '/'} />
            <MobileNavLink to="/about" label="About" current={location.pathname === '/about'} />
            <MobileNavLink to="/history" label="History" current={location.pathname === '/history'} />
            <MobileNavLink to="/contact" label="Contact" current={location.pathname === '/contact'} />
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, label, current }) => (
  <Link
    to={to}
    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
      current
        ? 'text-indigo-700 bg-indigo-50'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, label, current }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      current
        ? 'text-indigo-700 bg-indigo-50'
        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
    }`}
  >
    {label}
  </Link>
);

export default Header;