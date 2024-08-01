'use client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Feedbackcomp from '@/components/contactpage/Feedback';
import { useRouter } from 'next/navigation';
export default function Feedback() {
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
        <Feedbackcomp onNavigateHome={handleNavigateHome} />
        <Footer />
      </section>
    </>
  );
}
