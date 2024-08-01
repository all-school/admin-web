'use client';

import AllFeatures from '@/components/featurespage/AllFeatures';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import CallToActions from '@/components/CallToActions';

function Homepage() {
  return (
    <>
      <section className="font-Ubuntu bg-white">
        <section className="w-full bg-white px-6 pt-3 xl:px-8">
          <Navbar />
        </section>
        <AllFeatures />
        <CallToActions />
        <Footer />
      </section>
    </>
  );
}

export default Homepage;
