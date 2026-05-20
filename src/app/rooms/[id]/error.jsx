"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  SearchX,
  Home,
} from "lucide-react";

const RoomDetailsError = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-[#07111f] flex items-center justify-center px-6">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[140px] rounded-full"></div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* Main Content */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 md:p-16 shadow-2xl text-center">
          {/* Animated Icon */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
            className="w-28 h-28 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-8"
          >
            <SearchX className="w-14 h-14 text-red-400" />
          </motion.div>

          {/* Error Code */}
          <motion.h1
            initial={{
              scale: 0.8,
            }}
            animate={{
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              duration: 0.5,
            }}
            className="text-7xl md:text-8xl font-black text-white"
          >
            404
          </motion.h1>

          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-5">
            Room Not Found
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg leading-relaxed mt-6 max-w-xl mx-auto">
            The study room you are
            looking for may have been
            removed, renamed, or is
            temporarily unavailable.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-10">
            <Link href="/rooms">
              <button className="group bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-[0_10px_40px_rgba(6,182,212,0.35)] flex items-center gap-3">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />

                Browse Rooms
              </button>
            </Link>

            <Link href="/">
              <button className="group border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center gap-3">
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />

                Back Home
              </button>
            </Link>
          </div>

          {/* Small Footer */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-sm">
              Need help? Contact Study
              Nook support for
              assistance.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default RoomDetailsError;