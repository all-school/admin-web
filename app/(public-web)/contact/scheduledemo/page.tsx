'use client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Scheduledemocomp from '@/components/contactpage/ScheduleDemo';
import { useRouter } from 'next/navigation';

export default function Scheduledemo() {
  const router = useRouter();

  const handleNavigateHome = () => {
    router.push('/');
  };
  return (
    <>
      <section className="font-Ubuntu bg-white">
        <section className="w-full bg-white px-6 pt-3 xl:px-8">
          <Navbar />
        </section>
        <Scheduledemocomp onNavigateHome={handleNavigateHome} />
        <Footer />
      </section>
    </>
  );
}
