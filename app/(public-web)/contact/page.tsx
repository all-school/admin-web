'use client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Contactcomp from '@/components/contactpage/Contact';
import CallToActions from '@/components/CallToActions';

export default function Contact() {
  return (
    <>
      <section className="font-Ubuntu bg-white">
        <section className="w-full bg-white px-6 pt-3 xl:px-8">
          <Navbar />
        </section>
        <Contactcomp />
        <CallToActions />
        <Footer />
      </section>
    </>
  );
}
