'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useAuthStore } from '@/stores/authStore'; // Adjust this import path as needed

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
    };

    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  if (!isAuthenticated) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <>
      <Header />
      <div className="flex overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Sidebar />
        <main className="flex-1 overflow-hidden px-4 pb-4 pt-16">
          <div className="h-full overflow-y-auto rounded-lg bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-800/50">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
