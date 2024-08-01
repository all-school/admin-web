'use client';

import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Inquirycomp from '@/components/contactpage/Inquiry';

export default function Inquiry() {
  const router = useRouter();

  const handleNavigateHome = () => {
    router.push('/');
  };

  return (
    <section className="font-Ubuntu bg-white">
      <section className="w-full bg-white px-6 pt-3 xl:px-8">
        <Navbar />
      </section>
      <Inquirycomp onNavigateHome={handleNavigateHome} />
      <Footer />
    </section>
  );
}
