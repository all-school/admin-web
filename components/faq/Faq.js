const Faq = () => {
  const handleClick = (val) => {
    if (document.getElementById('value' + val).className == 'hidden') {
      document.getElementById('value' + val).className =
        'pt-0 -mt-2 text-gray-400 sm:text-lg py-7 px-7';
    } else {
      document.getElementById('value' + val).className = 'hidden';
    }
  };

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-8 lg:px-16">
        <h2 className="mb-2 text-center text-xl font-bold md:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="relative mt-12 space-y-5">
          {/* Question 1 */}
          <div
            onClick={() => handleClick('1')}
            className="relative select-none overflow-hidden rounded-lg border-2 border-gray-200 hover:bg-white"
          >
            <h4 className="flex cursor-pointer items-center justify-between px-7 py-7 text-lg font-medium text-gray-700 hover:text-gray-800 sm:text-xl">
              <span>Where do I go to upgrade my account?</span>
              <svg
                className="mr-2 h-6 w-6 rotate-0 transform transition-all duration-200 ease-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
            <p className="hidden" id="value1">
              You can upgrade your account by visiting The Pro Upgrade Page. You
              will also gain access to many other applications and sections of
              the site.
            </p>
          </div>
          {/* Question 2 */}
          <div
            onClick={() => handleClick('2')}
            className="relative select-none overflow-hidden rounded-lg border-2 border-gray-200 hover:bg-white"
          >
            <h4 className="flex cursor-pointer items-center justify-between px-7 py-7 text-lg font-medium text-gray-700 hover:text-gray-800 sm:text-xl">
              <span>How do I use Tails in my project?</span>
              <svg
                className="mr-2 h-6 w-6 rotate-0 transform transition-all duration-200 ease-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
            <p className="hidden" id="value2">
              Implementation in your project is very simple. You can use the
              exported page as a starting point, or you can copy and paste the
              HTML into your own page.
            </p>
          </div>
          {/* Question 3 */}
          <div
            onClick={() => handleClick('3')}
            className="relative select-none overflow-hidden rounded-lg border-2 border-gray-200 hover:bg-white"
          >
            <h4 className="flex cursor-pointer items-center justify-between px-7 py-7 text-lg font-medium text-gray-700 hover:text-gray-800 sm:text-xl">
              <span>How long will I have access to Tails?</span>
              <svg
                className="mr-2 h-6 w-6 rotate-0 transform transition-all duration-200 ease-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
            <p className="hidden" id="value3">
              You will have unlimited access to all your pre-built pages;
              however, if you want to be able to download and export your pages,
              you'll need a pro account. Paddle for processing payments.
            </p>
          </div>
          {/* Question 4 */}
          <div
            onClick={() => handleClick('4')}
            className="relative select-none overflow-hidden rounded-lg border-2 border-gray-200 hover:bg-white"
          >
            <h4 className="flex cursor-pointer items-center justify-between px-7 py-7 text-lg font-medium text-gray-700 hover:text-gray-800 sm:text-xl">
              <span>What is the license on the pages?</span>
              <svg
                className="mr-2 h-6 w-6 rotate-0 transform transition-all duration-200 ease-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
            <p className="hidden" id="value4">
              You have unlimited use to the templates used in Tails; however,
              you cannot re-use the templates to sell for others to use.
            </p>
          </div>
          {/* Question 5 */}
          <div
            onClick={() => handleClick('5')}
            className="relative select-none overflow-hidden rounded-lg border-2 border-gray-200 hover:bg-white"
          >
            <h4 className="flex cursor-pointer items-center justify-between px-7 py-7 text-lg font-medium text-gray-700 hover:text-gray-800 sm:text-xl">
              <span>What if I need help with my project?</span>
              <svg
                className="mr-2 h-6 w-6 rotate-0 transform transition-all duration-200 ease-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </h4>
            <p className="hidden" id="value5">
              If you need assistance implementing the templates into your
              project you can contact support or you can visit our question
              section.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
