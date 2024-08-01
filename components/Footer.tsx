'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Facebook from 'lucide-react/dist/esm/icons/facebook';
import Instagram from 'lucide-react/dist/esm/icons/instagram';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import Github from 'lucide-react/dist/esm/icons/github';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//in.fw-cdn.com/30838335/443256.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log('Signed up with:', email);
    setEmail('');
  };

  const socialIcons = [
    { Icon: Facebook, name: 'Facebook', href: '#' },
    { Icon: Instagram, name: 'Instagram', href: '#' },
    { Icon: Twitter, name: 'Twitter', href: '#' },
    { Icon: Github, name: 'GitHub', href: '#' },
    { Icon: Linkedin, name: 'LinkedIn', href: '#' }
  ];

  return (
    <footer className="font-Ubuntu bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <img
              className="h-10"
              src="/path-to-your-logo.svg"
              alt="AllSchool"
            />
            <p className="text-sm leading-6 text-gray-300">
              Empowering education through innovative technology solutions.
            </p>
            <div className="flex space-x-6">
              {socialIcons.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 transition-colors duration-300 hover:text-white"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.Icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                  Solutions
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    'Learning Management',
                    'Student Information',
                    'Virtual Classroom',
                    'Analytics'
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-base text-gray-300 transition-colors duration-300 hover:text-white"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {['Pricing', 'Documentation', 'Guides', 'API Status'].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-base text-gray-300 transition-colors duration-300 hover:text-white"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {['About', 'Blog', 'Jobs', 'Press', 'Partners'].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-base text-gray-300 transition-colors duration-300 hover:text-white"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    'Privacy',
                    'Terms',
                    'Cookie Policy',
                    'Trademark Policy'
                  ].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-base text-gray-300 transition-colors duration-300 hover:text-white"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-indigo-700 pt-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-200">
                Subscribe to our newsletter
              </h3>
              <p className="mt-4 text-base text-gray-300">
                Stay up to date with the latest news, announcements, and
                articles.
              </p>
              <form
                className="mt-4 sm:flex sm:max-w-md"
                onSubmit={handleSubmit}
              >
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  name="email-address"
                  id="email-address"
                  autoComplete="email"
                  required
                  className="w-full min-w-0 appearance-none rounded-md border border-transparent bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 focus:border-white focus:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-800"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="mt-3 rounded-md sm:ml-3 sm:mt-0 sm:flex-shrink-0">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md bg-indigo-500 px-4 py-2 text-base font-medium text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-indigo-800"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </motion.div>
            <div className="flex items-center justify-center lg:justify-end">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} AllSchool. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
