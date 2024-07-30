const CallToActions = () => {
  return (
    <section className="font-Ubuntu bg-white pb-32 pt-20">
      <div className="mx-auto w-full space-y-8 px-12 text-left md:text-center lg:px-0">
        <p className="mx-auto text-lg font-medium text-indigo-600">
          Try the new allschool beta for free
        </p>
        <h2 className="mx-auto w-full text-5xl font-medium text-gray-800 md:text-6xl">
          The Ultimate Platform for{' '}
          <span className="text-indigo-600">Institutions</span>
        </h2>
        <p className="mx-auto w-full text-lg text-gray-600 opacity-80">
          Your school community deserves an experience that will help them
          understand the passion behind your idea.
        </p>
        <div className="flex w-full flex-col items-center justify-start space-y-5 md:flex-row md:justify-center md:space-x-5 md:space-y-0">
          <a
            href="https://app.all.school/controller/schoolsignup"
            className="w-full rounded-lg bg-indigo-500 px-10 py-4 text-center font-medium text-white hover:bg-indigo-600 md:w-auto"
          >
            Try Free
          </a>
          <a
            //href="#_"
            href="/contact/scheduledemo"
            className="w-full rounded-lg border border-gray-600 px-10 py-4 text-center font-medium text-gray-600 hover:bg-gray-700 hover:text-white md:w-auto "
          >
            Talk to Sales
          </a>
        </div>
      </div>
    </section>
  );
};

export default CallToActions;
