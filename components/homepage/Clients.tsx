const Client = () => {
  return (
    <section className="font-Ubuntu mt-2 bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-10 text-center">
        <h2 className="mt-3 text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl ">
          Trusted by top-leading institutions
        </h2>
        <p className="intro mx-auto -mt-2 w-full py-8 text-center text-lg text-gray-700 sm:max-w-3xl">
          We've been trusted and used by some of the top institutions in the
          education industry.
        </p>
        <div className="my-12 grid grid-cols-1 gap-10 sm:my-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/thornton.png" className="h-auto w-1/2" />
            <p className="mt-2 text-sm text-gray-500">United Kingdom</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/stpeter.png" className="h-auto w-1/2" />
            <p className="mt-2 text-sm text-gray-500">United Kingdom</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/kingsnorth.png" className="h-auto w-1/2" />
            <p className="mt-2 text-sm text-gray-500">United Kingdom</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/westspringhill.png" className="h-auto w-1/2" />
            <p className="mt-2 text-sm text-gray-500">Australia</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/jerryorgill.png" className="h-auto w-1/2" />
            <p className="mt-4 font-bold text-gray-800">Jerry Orgill</p>
            <p className="mt-2 text-sm text-gray-500">United Kingdom</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/myland.png" className="h-auto w-1/2" />
            <p className="mt-4 font-bold text-gray-800">Myland</p>
            <p className="mt-2 text-sm text-gray-500">USA</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/stmichael.png" className="h-auto w-1/2" />
            <p className="mt-4 font-bold text-gray-800">St Michael’s</p>
            <p className="mt2 text-sm text-gray-500">India</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 py-10 shadow-lg">
            <img src="images/heathernorth.png" className="h-auto w-1/2" />
            <p className="mt-4 font-bold text-gray-800">Heathernorth</p>
            <p className="mt-2 text-sm text-gray-500">United Kingdom</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <a
          href="/customers"
          className="inline-flex justify-center rounded-md border border-indigo-500 border-transparent px-10 py-3 text-base font-medium text-indigo-500 shadow hover:bg-indigo-600 hover:text-white"
        >
          {' '}
          View our clients{' '}
        </a>
      </div>
    </section>
  );
};
export default Client;
