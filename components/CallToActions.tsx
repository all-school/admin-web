'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';

const CallToActions: React.FC = () => {
  return (
    <section className="font-Ubuntu bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-cyan-500/10" />
          <div className="relative z-10 px-6 py-12 sm:px-12 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                <Sparkles className="mr-2 h-4 w-4" />
                New Beta Available
              </span>
              <h2 className="mt-6 bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
                The Ultimate Platform for
                <br />
                <span className="text-blue-600">Institutions</span>
              </h2>
              <p className="mt-6 text-xl text-gray-600">
                Your school community deserves an experience that will help them
                understand the passion behind your idea.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <a
                href="https://app.all.school/controller/schoolsignup"
                className="group inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-blue-700 sm:w-auto"
              >
                Try Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
              <a
                href="/contact/scheduledemo"
                className="group inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-3 text-lg font-semibold text-blue-600 transition-all duration-200 hover:bg-blue-50 sm:w-auto"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Talk to Sales
              </a>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-1/2 h-32 w-32 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-500 opacity-20 blur-2xl" />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-500 opacity-20 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CallToActions;
