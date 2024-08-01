'use client';
import Faq from '@/components/faq/Faq';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import CallToActions from '@/components/CallToActions';

function Faqpage() {
  return (
    <>
      <section className="font-Ubuntu bg-white">
        <section className="w-full bg-white px-6  pt-3 xl:px-8">
          <Navbar />
        </section>
        <Faq />
        <CallToActions />

        <Footer />
      </section>
    </>
  );
}

export default Faqpage;
