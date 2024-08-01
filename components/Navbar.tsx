'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-bold text-indigo-600">
                allschool.
              </span>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) =>
              item.items ? (
                <div key={item.label} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-indigo-600 focus:bg-gray-100 focus:text-indigo-600 focus:outline-none"
                  >
                    {item.label}
                    <svg
                      className="-mr-0.5 ml-2 inline-block h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {activeDropdown === item.label && (
                    <div className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              className="-m-3 flex items-start rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <div className="ml-4">
                                <p className="text-base font-medium text-gray-900">
                                  {subItem.label}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-indigo-600 focus:bg-gray-100 focus:text-indigo-600 focus:outline-none"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="https://app.all.school/controller/login"
              className="text-sm font-medium text-gray-700 transition duration-150 ease-in-out hover:text-indigo-600"
            >
              Sign In
            </Link>
            <Link
              href="https://app.all.school/controller/schoolsignup"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Try Free
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {menuVisible ? (
                <svg
                  className="block h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuVisible && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item) =>
              item.items ? (
                <div key={item.label}>
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-indigo-600 focus:bg-gray-100 focus:text-indigo-600 focus:outline-none"
                  >
                    {item.label}
                  </button>
                  {activeDropdown === item.label && (
                    <div className="pl-4">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-indigo-600 focus:bg-gray-100 focus:text-indigo-600 focus:outline-none"
                          onClick={() => {
                            setActiveDropdown(null);
                            setMenuVisible(false);
                          }}
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
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-indigo-600 focus:bg-gray-100 focus:text-indigo-600 focus:outline-none"
                  onClick={() => setMenuVisible(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
          <div className="border-t border-gray-200 pb-3 pt-4">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <Link
                  href="https://app.all.school/controller/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 transition duration-150 ease-in-out hover:text-indigo-600"
                  onClick={() => setMenuVisible(false)}
                >
                  Sign In
                </Link>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="https://app.all.school/controller/schoolsignup"
                  className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-base font-medium text-white transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  onClick={() => setMenuVisible(false)}
                >
                  Try Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
