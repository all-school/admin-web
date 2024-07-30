'use client';

import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft, Menu } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import { motion } from 'framer-motion';

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <motion.nav
      initial={false}
      animate={isMinimized ? { width: 72 } : { width: 288 }}
      transition={{ duration: 0.3 }}
      className={cn(
        `relative z-10 hidden h-screen flex-none border-r pt-20 md:block`,
        status && 'duration-500',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800" />
      <div
        className="bg-grid-purple-200/50 dark:bg-grid-gray-700/25 absolute inset-0 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
        style={{ backgroundSize: '30px 30px' }}
      />

      <motion.div
        className="absolute -right-4 top-24 z-30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={handleToggle}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-200 bg-white text-purple-600 shadow-md hover:bg-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700"
        >
          {isMinimized ? <Menu size={16} /> : <ChevronLeft size={16} />}
        </button>
      </motion.div>

      <div className="relative z-20 space-y-4 overflow-hidden py-4">
        <div className="px-3 py-2">
          <motion.div
            initial={false}
            animate={isMinimized ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-purple-700 dark:text-purple-300">
              Dashboard
            </h2>
          </motion.div>
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
