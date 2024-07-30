'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type NavItem = {
  label: string;
  href: string;
};

type DropdownItem = NavItem & {
  items?: NavItem[];
};

const navItems: DropdownItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Product',
    href: '#',
    items: [
      { label: 'Features', href: '/features' },
      { label: 'Customers', href: '/customers' }
    ]
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' }
];

const Navbar: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <section className="relative">
      <div className="absolute left-0 top-0 h-3 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-green-400" />
      <nav className="relative mx-auto max-w-7xl pt-6 md:flex md:items-center md:justify-between md:pb-6">
        <div className="relative z-20 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-800 hover:text-indigo-500 md:text-2xl"
          >
            allschool.
          </Link>
          <button
            type="button"
            className="text-gray-500 hover:text-indigo-500 md:hidden"
            aria-label="toggle menu"
            onClick={toggleMenu}
          >
            {menuVisible ? (
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`left-0 z-10 w-full select-none md:flex md:items-center md:justify-center ${
            menuVisible ? 'flex' : 'hidden'
          }`}
        >
          <div className="mt-4 flex w-full flex-col justify-center space-y-2 md:ml-5 md:mt-0 md:flex-row md:space-x-6 md:space-y-0 lg:ml-5 lg:space-x-10 xl:ml-5 xl:space-x-16">
            {navItems.map((item) =>
              item.items ? (
                <div key={item.label} className="relative">
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className="flex cursor-pointer items-center py-3 font-medium text-gray-800 hover:text-indigo-500"
                  >
                    {item.label}
                    <svg
                      className="ml-2 h-5 w-5 text-gray-800"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {activeDropdown === item.label && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-500 hover:text-white"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="py-3 font-medium text-gray-800 hover:text-indigo-500"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>

        <div
          className={`relative z-20 mt-4 flex flex-col justify-center space-y-8 md:mt-0 md:flex-row md:items-center md:space-x-6 md:space-y-0 ${
            menuVisible ? 'flex' : 'hidden md:flex'
          }`}
        >
          <Link
            href="https://app.all.school/controller/login"
            className="font-medium text-gray-900 hover:text-indigo-500 md:font-semibold"
          >
            Sign In
          </Link>
          <Link
            href="https://app.all.school/controller/schoolsignup"
            className="w-auto rounded-lg bg-transparent text-left text-base font-medium text-gray-800 hover:bg-indigo-600 hover:text-white md:bg-indigo-500 md:px-8 md:py-3 md:text-center md:text-sm md:font-semibold md:text-white"
          >
            Try Free
          </Link>
        </div>
      </nav>
    </section>
  );
};

export default Navbar;
