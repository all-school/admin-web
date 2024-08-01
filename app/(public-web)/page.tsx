import React from 'react';
import Client from '@/components/homepage/Clients';
import Features from '@/components/homepage/Features';
import Footer from '@/components/Footer';
import CallToActions from '@/components/CallToActions';
import Header from '@/components/homepage/Header';
import Steps from '@/components/homepage/Steps';
import Video from '@/components/homepage/Video';

function HomePage() {
  return (
    <section className="font-Ubuntu bg-white">
      <Header />

      <Video />

      <Client />

      <Features />

      <Steps />

      <CallToActions />

      <Footer />
    </section>
  );
}

export default HomePage;
