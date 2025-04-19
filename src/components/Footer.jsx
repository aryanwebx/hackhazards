import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">SafeNet</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm">
              Empowering digital spaces with intelligent content moderation.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Product</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-indigo-400 transition-colors">About</Link></li>
              <li><Link to="/history" className="text-gray-400 hover:text-indigo-400 transition-colors">History</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            &copy; {currentYear} SafeNet. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;