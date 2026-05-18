"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const NotFound = () => {
  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/banner.png"
          alt="Background"
          fill
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/40 via-black/50 to-black/80"></div>

      {/* Floating Blur */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 blur-3xl rounded-full"></div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6"
      >
        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 0.6,
            type: "spring",
            stiffness: 120,
          }}
          className="text-8xl md:text-[170px] font-extrabold text-cyan-400 drop-shadow-[0_0_35px_rgba(34,211,238,0.5)]"
        >
          404
        </motion.h1>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold text-white mt-4">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mt-5 leading-relaxed">
          The page you are looking for doesn’t exist or may have been moved.
          Explore available study rooms and continue your journey.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
          <Link href="/">
            <button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-4 rounded-xl text-lg font-semibold text-white shadow-2xl cursor-pointer">
              Back To Home
            </button>
          </Link>

          <Link href="/rooms">
            <button className="border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 px-8 py-4 rounded-xl text-lg font-semibold text-white cursor-pointer">
              Explore Rooms
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default NotFound;