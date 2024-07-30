import Navbar from '@/components/Navbar';

const Header = () => {
  return (
    <section className="font-Ubuntu w-full overflow-hidden bg-white px-6 pt-3 xl:px-8">
      <Navbar />
      <div className="container mx-auto pt-16 text-left md:text-center">
        <div className="relative mx-auto max-w-4xl">
          <h1 className="bg-gradient-to-r from-indigo-600 via-blue-500 to-green-400 bg-clip-text pb-3 text-left text-4xl font-extrabold text-transparent sm:text-5xl md:text-center md:text-7xl">
            There's better way to communicate
          </h1>
          <p className="mt-8 text-left text-sm text-gray-500 sm:text-base md:mx-auto md:max-w-xl md:text-center md:text-lg">
            allschool is your all in one platform where educational institution
            and parents meet. Have the exact solution your institution needs to
            engage parents at every step of students' journey.
          </p>
          <a
            href="https://app.all.school/controller/schoolsignup"
            className="mt-10 inline-flex w-full items-center justify-center rounded-lg border border-transparent bg-indigo-500 py-4 text-base font-medium text-white hover:bg-indigo-600 md:mx-0 md:w-auto md:bg-indigo-500 md:px-8 md:py-3 md:text-center md:text-sm md:font-medium md:text-white"
          >
            {' '}
            Try Free{' '}
          </a>
        </div>
      </div>
    </section>
  );
};
export default Header;
