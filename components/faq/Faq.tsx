import { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200">
    <button
      className="flex w-full items-center justify-between px-6 py-4 text-left focus:outline-none"
      onClick={onClick}
    >
      <span className="text-lg font-medium text-gray-900">{question}</span>
      {isOpen ? (
        <Minus className="h-5 w-5 text-indigo-600" />
      ) : (
        <Plus className="h-5 w-5 text-gray-400" />
      )}
    </button>
    <div
      className={`px-6 transition-all duration-300 ease-in-out ${
        isOpen
          ? 'max-h-96 pb-6 opacity-100'
          : 'max-h-0 overflow-hidden opacity-0'
      }`}
    >
      <p className="text-gray-600">{answer}</p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: 'How does the parent-teacher communication feature work?',
      answer:
        "Our parent-teacher communication feature allows for seamless interaction between parents and teachers. Parents can send messages, schedule meetings, and receive updates about their child's progress. Teachers can share assignments, grades, and behavior reports directly with parents. All communications are securely stored and easily accessible through our user-friendly interface."
    },
    {
      question:
        "Can I track my child's attendance and academic progress in real-time?",
      answer:
        "Absolutely! Our system provides real-time updates on your child's attendance and academic progress. Parents can view attendance records, check grades for individual assignments and exams, and monitor overall performance trends. You'll receive notifications for important updates, ensuring you're always informed about your child's educational journey."
    },
    {
      question: 'How secure is the student information stored in your system?',
      answer:
        'We take data security very seriously. All student information is encrypted and stored in compliance with FERPA regulations. We use industry-standard security protocols to protect data both in transit and at rest. Access to sensitive information is strictly controlled through role-based permissions, ensuring that only authorized personnel can view or modify student data.'
    },
    {
      question:
        'Can teachers use the system to manage assignments and grading?',
      answer:
        'Yes, our system offers comprehensive tools for teachers to manage assignments and grading. Teachers can create and distribute assignments, set due dates, and grade submissions all within the platform. The grading system supports various formats, including letter grades, percentages, and custom rubrics. Automated grade calculations help streamline the process and reduce errors.'
    },
    {
      question: 'Is the platform accessible on mobile devices?',
      answer:
        "Definitely! Our platform is fully responsive and can be accessed on any device with an internet connection. We also offer dedicated mobile apps for both iOS and Android, providing a seamless experience for parents, teachers, and administrators on the go. Push notifications ensure you never miss important updates, regardless of the device you're using."
    },
    {
      question:
        'How does your system handle school-wide announcements and emergency notifications?',
      answer:
        'Our platform includes a robust announcement system for school-wide communications. Administrators can send out announcements to specific groups or the entire school community. For emergencies, we have a priority notification system that sends alerts via multiple channels (app, email, SMS) to ensure critical information reaches everyone quickly. Parents can customize their notification preferences for different types of communications.'
    },
    {
      question:
        'Can the system accommodate different grading scales or curriculum standards?',
      answer:
        "Yes, our system is highly flexible and can be customized to accommodate various grading scales and curriculum standards. Whether your school uses a traditional A-F scale, percentages, or follows specific national or international curriculum standards, our platform can be configured to match your needs. This ensures that grading and progress tracking align perfectly with your school's educational approach."
    }
  ];

  return (
    <section className="bg-gradient-to-br from-indigo-50 to-white py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Can't find the answer you're looking for? Reach out to our{' '}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              support team
            </a>
            .
          </p>
        </div>
        <div className="mt-12 space-y-6">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={index === openIndex}
              onClick={() => setOpenIndex(index === openIndex ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
