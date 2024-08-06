'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { useAuthStore } from '@/stores/authStore';
import { Skeleton } from '@/components/ui/skeleton';

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
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <Skeleton className="h-16 w-full" /> {/* Header skeleton */}
        <div className="flex flex-1 overflow-hidden">
          <Skeleton className="h-full w-64" /> {/* Sidebar skeleton */}
          <main className="mt-16 flex-1 overflow-hidden p-4">
            {' '}
            {/* Added mt-16 */}
            <div className="h-full overflow-y-auto rounded-lg bg-white/50 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-800/50">
              <Skeleton className="mb-4 h-8 w-full" /> {/* Title skeleton */}
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" /> {/* Content skeleton */}
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="flex min-h-screen ">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="mt-16 flex-1 overflow-hidden p-4">
          {' '}
          {/* Added mt-16 */}
          <div className="h-full overflow-y-auto rounded-lg bg-white/50 shadow-lg backdrop-blur-sm dark:bg-gray-800/50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
