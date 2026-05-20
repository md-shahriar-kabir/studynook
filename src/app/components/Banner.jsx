
"use client";

import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowRight,
  BookOpenCheck,
  Sparkles,
} from "lucide-react";

const Banner = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/banner.png"
          alt="Study Room Banner"
          fill
          priority
          className="object-cover scale-105"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#07111f]/75"></div>

      {/* Cyan Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 blur-[140px] rounded-full"></div>

      {/* Grid Effect */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* Floating Blur */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute top-40 right-20 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"
      ></motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 items-center gap-16">
          {/* Left Side */}
          <motion.div
            initial={{
              opacity: 0,
              y: 60,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="space-y-8"
          >
            {/* Top Badge */}
            <motion.div
              initial={{
                opacity: 0,
                x: -40,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.8,
              }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3"
            >
              <Sparkles className="w-5 h-5 text-cyan-400" />

              <span className="text-sm uppercase tracking-[4px] text-cyan-300 font-semibold">
                Smart Study Environment
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.4,
                duration: 1,
              }}
            >
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-tight text-white">
                Discover
                <br />

                <span className="relative inline-block text-cyan-400">
                  Perfect
                  <motion.span
                    animate={{
                      width: [
                        "0%",
                        "100%",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 1.5,
                    }}
                    className="absolute left-0 bottom-2 h-3 bg-cyan-500/20 rounded-full"
                  ></motion.span>
                </span>{" "}
                Study Rooms
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.7,
                duration: 1,
              }}
              className="text-lg md:text-2xl text-gray-300 leading-relaxed max-w-2xl"
            >
              Book quiet, comfortable,
              and fully equipped study
              rooms near you. Create
              the perfect environment
              for productivity,
              collaboration, and
              focused learning.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 1,
                duration: 1,
              }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/rooms">
                <button className="group bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-5 rounded-2xl text-lg font-bold text-white shadow-[0_10px_40px_rgba(6,182,212,0.35)] flex items-center gap-3">
                  Explore Rooms

                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/signup">
                <button className="group border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 px-8 py-5 rounded-2xl text-lg text-white font-semibold flex items-center gap-3">
                  Become a Host

                  <BookOpenCheck className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
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
                delay: 1.2,
                duration: 1,
              }}
              className="flex flex-wrap gap-8 pt-6"
            >
              <div>
                <h3 className="text-4xl font-black text-white">
                  500+
                </h3>

                <p className="text-gray-400 mt-1">
                  Study Rooms
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-white">
                  10K+
                </h3>

                <p className="text-gray-400 mt-1">
                  Happy Students
                </p>
              </div>

              <div>
                <h3 className="text-4xl font-black text-white">
                  24/7
                </h3>

                <p className="text-gray-400 mt-1">
                  Booking Access
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side Card */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.6,
              duration: 1,
            }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              {/* Glow */}
              <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-[40px]"></div>

              {/* Glass Card */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="relative bg-white/10 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 shadow-2xl max-w-md"
              >
                <div className="relative h-[450px] w-[350px] rounded-[30px] overflow-hidden">
                  <Image
                    src="/assets/banner.png"
                    alt="Study Room"
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Floating Mini Card */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  className="absolute -bottom-8 -left-8 bg-[#0d1b2a] border border-white/10 rounded-3xl p-5 shadow-2xl"
                >
                  <p className="text-gray-400 text-sm">
                    Available Today
                  </p>

                  <h3 className="text-white text-3xl font-black mt-1">
                    126 Rooms
                  </h3>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#07111f] to-transparent"></div>
    </section>
  );
};

export default Banner;