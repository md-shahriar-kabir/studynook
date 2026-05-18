import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image src="/assets/banner.png" alt="Study Room Banner" fill />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
        <div className="max-w-4xl space-y-7">
          <p className="uppercase tracking-[5px] text-cyan-400 font-semibold">
            Find Your Ideal Study Space
          </p>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-2xl">
            Discover Your <br />
            <span className="text-cyan-400">Perfect Study Room</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
            Browse and book quiet, comfortable, and private study rooms near
            you. List your own room, connect with students, and earn extra
            income effortlessly.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-4">
            <Link href="/rooms">
              <button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-4 rounded-xl text-lg font-semibold shadow-2xl cursor-pointer">
                Explore Rooms
              </button>
            </Link>

            <Link href="/signup">
              <button className="border border-white/40 backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 px-8 py-4 rounded-xl text-lg text-white font-semibold cursor-pointer">
                Become a Host
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Blur Effect */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
    </section>
  );
};

export default Banner;
