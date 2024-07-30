'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Upload, MessageCircle, FileText } from 'lucide-react';

const FeatureCard = ({ Icon, title, description, image, reverse = false }) => {
  return (
    <motion.div
      className={`flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } mb-20 items-center`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8 w-full md:mb-0 md:w-1/2">
        <motion.img
          src={image}
          alt={title}
          className="rounded-lg shadow-xl"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className={`w-full md:w-1/2 ${reverse ? 'md:pr-12' : 'md:pl-12'}`}>
        <motion.div
          className="mb-4 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Icon size={32} className="text-indigo-500" />
          <h3 className="ml-3 text-2xl font-bold">{title}</h3>
        </motion.div>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      Icon: Upload,
      title: 'Post Made Easy',
      description:
        "Crafting your sharing experience has never been easier. With our intuitive post feature, you'll be sharing photos, videos, and documents with students' parents in no time.",
      image: 'images/Upload.gif'
    },
    {
      Icon: MessageCircle,
      title: 'Designed For Conversations',
      description:
        "Messenger has everything you desire to communicate with your students' parents privately. Stay connected and build stronger relationships.",
      image: 'images/conversation.gif'
    },
    {
      Icon: FileText,
      title: 'Get Intuition Swiftly With Forms',
      description:
        'Simply create and share forms and surveys online, and get responses from parents. Now, analyzing responses is easier than ever before.',
      image: 'images/Form.gif'
    }
  ];

  return (
    <section className="font-Ubuntu bg-gradient-to-b from-white to-indigo-50 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-4xl font-bold text-indigo-600 md:text-5xl">
            Our Awesome Features
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            See what you can do with AllSchool. We strive to make a product that
            is revolutionary.
          </p>
        </motion.div>

        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            Icon={feature.Icon}
            title={feature.title}
            description={feature.description}
            image={feature.image}
            reverse={index % 2 !== 0}
          />
        ))}

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <a
            href="/features"
            className="inline-block transform rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-lg"
          >
            View All Features
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
