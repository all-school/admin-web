const Video = () => {
  return (
    <div className="flex flex-grow items-center justify-center bg-white">
      <video
        autoPlay
        loop
        muted
        className="relative z-10 mt-10 w-5/6 transform rounded-xl p-0 shadow-2xl lg:scale-95"
      >
        <source src={'video/allschool_demo.mp4'} type="video/mp4" />
      </video>
    </div>
  );
};
export default Video;
