'use client';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Pricingcomp from '@/components/pricingpage/Pricingcomponent';

export default function Pricing() {
  return (
    <>
      <section className="font-Ubuntu bg-white">
        <section className="w-full bg-white px-6 pt-3 xl:px-8">
          <Navbar />
        </section>
        <Pricingcomp />
        <Footer />
      </section>
    </>
  );
}
