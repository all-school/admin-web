//import Providers from '@/components/layout/providers';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
//import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

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

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  //const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body className={`${inter.className} overflow-hidden`}>
       
        <NextTopLoader showSpinner={false} />
     
          <Toaster />
          {children}
      
      </body> */}
      <body>{children}</body>
    </html>
  );
}
