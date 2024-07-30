const Contact = () => {
  return (
    <section class="font-Ubuntu relative box-border w-full border-0 border-solid border-gray-200 bg-white font-sans leading-6 text-gray-700">
      <div class="mx-auto box-border flex max-w-7xl flex-col items-center border-solid px-8 py-20 leading-6 md:items-stretch md:justify-center md:py-24 xl:px-16">
        <div class="relative pb-10">
          <h5 class="mx-0 mb-4 mt-0 w-full border-0 border-gray-200 text-center font-bold text-indigo-600">
            Help and support
          </h5>
          <h2 class="m-0 w-full border-0 border-gray-200 text-center text-4xl font-black leading-loose tracking-wide text-gray-700 sm:text-5xl">
            Hi, how can we help?
          </h2>
          <p class="mx-0 mx-auto mb-0 mt-4 w-full max-w-xl border-0 border-gray-200 text-center text-sm font-medium leading-relaxed text-gray-400 md:text-base lg:text-lg">
            Have questions or feedback or need to report an issue with a
            allschool product or service? We've got you covered.
          </p>
        </div>

        <div class="z-10 grid gap-5 md:grid-cols-6 lg:grid-cols-9">
          <div class="col-span-3 rounded-3xl bg-gray-50 text-gray-700">
            <div class="mx-4 box-border flex h-full flex-col items-start border-solid px-2 py-8 text-center leading-6 sm:flex-row sm:items-start sm:text-left">
              {/* <div class="flex-shrink-0 p-3 font-sans text-gray-700 border border-gray-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="leading-6 text-center text-gray-700 align-middle stroke-current w-7 h-7" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M0 0h24v24H0z" stroke="none"></path>
                            <path d="M3 12h3M12 3v3M7.8 7.8L5.6 5.6M16.2 7.8l2.2-2.2M7.8 16.2l-2.2 2.2M12 12l9 3-4 2-2 4-3-9"></path></svg>
                    </div> */}
              <div class="mt-4 border-0 border-gray-200 text-left text-gray-700 sm:ml-4 sm:mt-2">
                <h6 class="box-border border-solid text-left text-2xl font-bold leading-none tracking-wide">
                  General inquiries
                </h6>
                <p class="mx-0 mb-0 mt-1 box-border border-solid font-medium leading-loose text-gray-400 sm:mt-4">
                  Have a question or want to say hi?
                </p>
                <div class="mt-6 border-0 border-gray-200 text-left text-gray-700 sm:ml-0 sm:mt-7">
                  <a
                    className="rounded-lg border border-indigo-600 px-10 py-3 text-center font-medium text-indigo-600 hover:bg-indigo-700 hover:text-white md:w-auto"
                    href="/contact/inquiry"
                  >
                    Contact us
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-3 rounded-3xl bg-gray-50 text-gray-700">
            <div class="mx-4 box-border flex h-full flex-col items-start border-solid px-2 py-8 text-center leading-6 sm:flex-row sm:items-start sm:text-left">
              {/* <div class="flex-shrink-0 p-3 font-sans text-gray-700 border border-gray-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="leading-6 text-center text-gray-700 align-middle stroke-current w-7 h-7" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M0 0h24v24H0z" stroke="none"></path>
                            <path d="M13 3v7h6l-8 11v-7H5l8-11"></path></svg>
                    </div> */}
              <div class="mt-4 border-0 border-gray-200 text-left text-gray-700 sm:ml-4 sm:mt-2">
                <h6 class="box-border border-solid text-left text-2xl font-bold leading-none tracking-wide">
                  Feedback
                </h6>
                <p class="mx-0 mb-0 mt-1 box-border border-solid font-medium leading-loose text-gray-400 sm:mt-4">
                  Let us know how we're doing
                </p>
                <div class="mt-6 border-0 border-gray-200 text-left text-gray-700 sm:ml-0 sm:mt-7">
                  <a
                    className="rounded-lg border border-indigo-600 px-10 py-3 text-center font-medium text-indigo-600 hover:bg-indigo-700 hover:text-white md:w-auto"
                    href="/contact/feedback"
                  >
                    Submit feedback
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-3 rounded-3xl bg-gray-50 text-gray-700">
            <div class="mx-4 box-border flex h-full flex-col items-start border-solid px-2 py-8 text-center leading-6 sm:flex-row sm:items-start sm:text-left">
              {/* <div class="flex-shrink-0 p-3 font-sans text-gray-700 border border-gray-200 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" class="leading-6 text-center text-gray-700 align-middle stroke-current w-7 h-7" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M0 0h24v24H0z" stroke="none"></path>
                            <path d="M9 4.55a8 8 0 016 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"></path></svg>
                    </div> */}
              <div class="border-0 border-gray-200 text-left text-gray-700 sm:ml-4 sm:mt-2">
                <h6 class="box-border border-solid text-left text-2xl font-bold leading-none tracking-wide">
                  Schedule a demo
                </h6>
                <p class="mx-0 mb-0 mt-1 box-border border-solid font-medium leading-loose text-gray-400 sm:mt-4">
                  Assessing our product and need advice before you try?
                </p>
                <div class="mt-6 border-0 border-gray-200 text-left text-gray-700 sm:ml-0 sm:mt-7">
                  <a //className="flex-shrink-0 font-medium md:font-semibold lg:font-semibold pt-1 pb-2 pl-2 pr-2 text-white rounded hover:bg-blue-300 bg-indigo-500"
                    className="rounded-lg border border-indigo-600 px-10 py-3 text-center font-medium text-indigo-600 hover:bg-indigo-700 hover:text-white md:w-auto"
                    href="/contact/scheduledemo"
                  >
                    Contact us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
