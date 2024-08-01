const Allfeatures = () => {
  return (
    <section className="mt-2 bg-white py-20">
      <div className="mx-auto flex max-w-7xl flex-col space-y-12 px-8 xl:px-12">
        <div className="relative">
          <h2 className="w-full text-center text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl">
            {' '}
            Our Awesome Features
          </h2>
          <p className="intro mx-auto -mt-2 w-full py-8 text-center text-lg text-gray-700 sm:max-w-3xl">
            See what you can do with allschool, We strive to make a product that
            is revolutionary.
          </p>
        </div>
        <div className="animated fadeIn mb-8 flex flex-col sm:flex-row ">
          <div className="mb-8 flex items-center sm:order-last sm:w-1/2 md:w-5/12">
            <img src="images/Upload.gif" />
          </div>
          <div className="mb-8 mt-5 flex flex-col justify-center sm:w-1/2 sm:pr-16 md:mt-0 md:w-7/12">
            <p className="mb-2 text-left text-sm font-semibold uppercase leading-none text-indigo-500">
              keep informed
            </p>
            <h3 className="mt-2 text-2xl text-gray-800 sm:text-left md:text-4xl">
              Post Made Easy
            </h3>
            <p className="text mt-5 text-lg text-gray-700 md:text-left">
              Crafting your sharing experience has never been easier, with our
              intuitive post feature you will be sharing photos, videos and
              documents with students' parents in no time.
            </p>
          </div>
        </div>
        <div className="animated fadeIn mb-8 mt-5 flex flex-col sm:flex-row ">
          <div className="mb-8 flex items-center sm:w-1/2 md:w-5/12">
            <img src="images/conversation.gif" />
          </div>
          <div className="mb-8 mt-5 flex flex-col justify-center sm:w-1/2 sm:pl-16 md:mt-0 md:w-7/12">
            <p className="mb-2 text-left text-sm font-semibold uppercase leading-none text-indigo-500">
              stay connected
            </p>
            <h3 className="mt-2 text-2xl text-gray-800 sm:text-left md:text-4xl">
              Designed For Conversations
            </h3>
            <p className="text mt-5 text-lg text-gray-700 md:text-left">
              Messenger has everything you desire to communicate with your
              students' parents privately.
            </p>
          </div>
        </div>
        <div className="animated fadeIn mb-8 mt-5 flex flex-col sm:flex-row ">
          <div className="mb-8 flex items-center sm:order-last sm:w-1/2 md:w-5/12">
            <img src="images/Form.gif" />
          </div>
          <div className="mb-8 mt-5 flex flex-col justify-center sm:w-1/2 sm:pr-16 md:mt-0 md:w-7/12">
            <p className="mb-2 text-left text-sm font-semibold uppercase leading-none text-indigo-500">
              Easy to ask
            </p>
            <h3 className="mt-2 text-2xl text-gray-800 sm:text-left md:text-4xl">
              Get Intuition Swiftly With Forms
            </h3>
            <p className="text mt-5 text-lg text-gray-700 md:text-left">
              Simply create and share forms and surveys online, and get
              responses from parents. Now, analyzing responses is easier than
              ever before.
            </p>
          </div>
        </div>
        <div className="animated fadeIn mb-8 mt-5 flex flex-col sm:flex-row">
          <div className="mb-8 flex items-center sm:w-1/2 md:w-5/12">
            <img src="images/Schedulecal.gif" />
          </div>
          <div className="mb-8 mt-5 flex flex-col justify-center sm:w-1/2 sm:pl-16 md:mt-0 md:w-7/12">
            <p className="mb-2 text-left text-sm font-semibold uppercase leading-none text-indigo-500">
              Schedule Smart
            </p>
            <h3 className="mt-2 text-2xl text-gray-800 sm:text-left md:text-4xl">
              Simple Scheduling Onward
            </h3>
            <p className="text mt-5 text-lg text-gray-700 md:text-left">
              Share special events with your students' parents with easy
              calendar publishing. So they can see full calendar of your
              institution for events like term holidays and exams.
            </p>
          </div>
        </div>
        <div className="animated fadeIn mb-8 mt-5 flex flex-col sm:flex-row ">
          <div className="mb-8 flex items-center sm:order-last sm:w-1/2 md:w-5/12">
            <img src="images/Studying.png" />
          </div>
          <div className="mb-8 mt-5 flex flex-col justify-center sm:w-1/2 sm:pr-16 md:mt-0 md:w-7/12">
            <p className="mb-2 text-left text-sm font-semibold uppercase leading-none text-indigo-500">
              take home
            </p>
            <h3 className="mt-2 text-2xl text-gray-800 sm:text-left md:text-4xl">
              Assignment Everywhere
            </h3>
            <p className="text mt-5 text-lg text-gray-700 md:text-left">
              Create assignments for your students in just a few clicks –
              whenever the moment is right. Now, managing assignment timelines
              and instructions is easier than ever before.
            </p>
          </div>
        </div>
        <div className="animated fadeIn mb-8 mt-5 flex flex-col sm:flex-row ">
          <div className="mb-8 flex items-center sm:w-1/2 md:w-5/12">
            <img src="images/Mail.gif" />
          </div>
          <div className="mb-8 mt-6 flex flex-col justify-center sm:w-1/2 sm:pl-16 md:mt-0 md:w-7/12">
            <p className="mb-2 text-left text-sm font-semibold uppercase leading-none text-indigo-500">
              reach inboxes
            </p>
            <h3 className="mt-2 text-2xl text-gray-800 sm:text-left md:text-4xl">
              Email and SMS Notifications Together
            </h3>
            <p className="text mt-5 text-lg text-gray-700 md:text-left">
              Trust that your transactional and essential updates get delivered
              with intelligent handling and industry-leading delivery expertise.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Allfeatures;
