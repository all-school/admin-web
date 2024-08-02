import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'All.School Management System',
    template: '%s | All.School'
  },
  description:
    'Comprehensive school management system for efficient administration, student tracking, and parent communication.',
  keywords: [
    'school management',
    'education',
    'student tracking',
    'administrative tools',
    'All.School'
  ],
  authors: [{ name: 'All.School Team' }],
  creator: 'All.School',
  publisher: 'All.School',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.all.school',
    siteName: 'All.School Management System',
    title: 'All.School Management System',
    description:
      'Efficient school management solution for modern educational institutions.',
    images: [
      {
        url: 'https://www.all.school/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'All.School Management System'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All.School Management System',
    description: 'Streamline your school administration with All.School',
    images: ['https://www.all.school/twitter-image.jpg'],
    creator: '@all_school'
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: '/site.webmanifest'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
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
