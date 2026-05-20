// "use client";
// import Link from "next/link";
// import { authClient } from "@/lib/auth-client";
// import { Avatar, Button } from "@heroui/react";

// const Navbar = () => {
//   const { data: session } = authClient.useSession();
//   const user = session?.user;

//   const handleSignOut = async() => {
//     await authClient.signOut();
//   }

//   return (
//     <nav className="flex items-center justify-between p-5">
//       <div>
//         <Link href={"/"}>
//           <h2 className="text-2xl font-extrabold">
//             Study{" "}
//             <span className="text-2xl text-cyan-400 font-extrabold">Nook</span>
//           </h2>
//         </Link>
//       </div>
//       <ul className="flex gap-3">
//         <li>
//           <Link href={"/"}>Home</Link>
//         </li>
//         <li>
//           <Link href={"/rooms"}>Rooms</Link>
//         </li>
//         <li>
//           <Link href={"/add-room"}>Add Room</Link>
//         </li>
//         <li>
//           <Link href={"/my-bookings"}>My Bookings</Link>
//         </li>
//       </ul>

//       <ul className="flex items-center gap-3">
//         <li>
//           <Link href={"/profile"}>My Profile</Link>
//         </li>

//         {user ? (
//           <>
//             <li>
//               <Avatar>
//                 <Avatar.Image
//                   alt="John Doe"
//                   src={user?.image}
//                 />
//                 <Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
//               </Avatar>
//             </li>
//             <li><Button onClick={handleSignOut} variant="danger">Logout</Button></li>
//           </>
//         ) : (
//           <>
//             <li>
//               <Link href={"/login"}>Login</Link>
//             </li>
//             <li>
//               <Link href={"/signup"}>Sign Up</Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
  Avatar,
  Button,
} from "@heroui/react";

import {
  Moon,
  Sun,
  Menu,
  X,
  BookOpenCheck,
} from "lucide-react";

import { motion } from "framer-motion";

const Navbar = () => {
  const pathname =
    usePathname();

  const { data: session } =
    authClient.useSession();

  const user = session?.user;

  const [darkMode, setDarkMode] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);

      document.documentElement.classList.remove(
        "dark",
      );
    } else {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark",
      );
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "light",
      );
    } else {
      document.documentElement.classList.add(
        "dark",
      );

      localStorage.setItem(
        "theme",
        "dark",
      );
    }

    setDarkMode(!darkMode);
  };

  const handleSignOut =
    async () => {
      await authClient.signOut();
    };

  const navItems = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Rooms",
      path: "/rooms",
    },
    {
      name: "Add Room",
      path: "/add-room",
    },
    {
      name: "My Bookings",
      path: "/my-bookings",
    },
  ];

  const navLinks = navItems.map(
    (item) => (
      <li key={item.path}>
        <Link
          href={item.path}
          className={`relative px-4 py-2 rounded-full transition-all duration-300 ${
            pathname === item.path
              ? darkMode
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-white text-cyan-600 shadow-lg"
              : darkMode
              ? "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
              : "text-white hover:bg-white/20"
          }`}
        >
          {item.name}

          {/* Active Dot */}
          {pathname ===
            item.path && (
            <span
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                darkMode
                  ? "bg-cyan-300"
                  : "bg-cyan-600"
              }`}
            ></span>
          )}
        </Link>
      </li>
    ),
  );

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
        darkMode
          ? "bg-[#07111f]/90 border-white/10 text-white"
          : "bg-cyan-500 text-white border-cyan-400/30 shadow-xl"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link
            href={"/"}
            className="flex items-center gap-3"
          >
            {/* Animated Icon */}
            <motion.div
              animate={{
                rotate: [
                  0,
                  -10,
                  10,
                  -10,
                  0,
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className={`p-2 rounded-2xl shadow-lg ${
                darkMode
                  ? "bg-cyan-500/20"
                  : "bg-white/20"
              }`}
            >
              <BookOpenCheck className="w-7 h-7 text-cyan-300" />
            </motion.div>

            {/* Logo Text */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-wide leading-none">
                Study{" "}
                <span
                  className={
                    darkMode
                      ? "text-cyan-400"
                      : "text-white"
                  }
                >
                  Nook
                </span>
              </h2>

              <p className="text-xs tracking-[3px] uppercase text-gray-300 mt-1">
                Smart Study Rooms
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-4 font-medium">
          {navLinks}
        </ul>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition ${
              darkMode
                ? "bg-white/5 border border-white/10 hover:bg-white/10"
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>

          {user ? (
            <>
              {/* Profile */}
              <Link
                href={"/profile"}
                className={`flex items-center gap-3 px-3 py-2 rounded-full transition ${
                  darkMode
                    ? "bg-white/5 hover:bg-white/10 border border-white/10"
                    : "bg-white/20 hover:bg-white/30"
                }`}
              >
                <Avatar
                  src={user?.image}
                  name={user?.name}
                  className="w-9 h-9"
                />

                <span className="text-sm font-medium">
                  {user?.name}
                </span>
              </Link>

              {/* Logout */}
              <Button
                onClick={
                  handleSignOut
                }
                className="bg-red-500 hover:bg-red-600 text-white rounded-full px-5"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href={"/login"}
              >
                <Button
                  variant="bordered"
                  className={`rounded-full px-5 ${
                    darkMode
                      ? "border-white/20 text-white"
                      : "border-white text-white"
                  }`}
                >
                  Login
                </Button>
              </Link>

              <Link
                href={"/signup"}
              >
                <Button className="bg-white text-cyan-600 hover:bg-gray-100 rounded-full px-5 font-semibold">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() =>
            setMenuOpen(
              !menuOpen,
            )
          }
          className="lg:hidden"
        >
          {menuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className={`lg:hidden px-6 py-6 border-t ${
            darkMode
              ? "bg-[#07111f] border-white/10"
              : "bg-cyan-500 border-white/20"
          }`}
        >
          <ul className="flex flex-col gap-5 font-medium">
            {navLinks}
          </ul>

          <div className="mt-6 flex flex-col gap-4">
            {/* Theme */}
            <button
              onClick={
                toggleTheme
              }
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl transition ${
                darkMode
                  ? "bg-white/5 border border-white/10"
                  : "bg-white/20"
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-white" />
                  Dark Mode
                </>
              )}
            </button>

            {user ? (
              <>
                <Link
                  href={
                    "/profile"
                  }
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${
                    darkMode
                      ? "bg-white/5 border border-white/10"
                      : "bg-white/20"
                  }`}
                >
                  <Avatar
                    src={
                      user?.image
                    }
                    name={
                      user?.name
                    }
                    className="w-10 h-10"
                  />

                  <span>
                    {
                      user?.name
                    }
                  </span>
                </Link>

                <Button
                  onClick={
                    handleSignOut
                  }
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={
                    "/login"
                  }
                >
                  <Button
                    className={`w-full rounded-2xl ${
                      darkMode
                        ? "border border-white/20 bg-transparent text-white"
                        : "bg-white/20 text-white"
                    }`}
                  >
                    Login
                  </Button>
                </Link>

                <Link
                  href={
                    "/signup"
                  }
                >
                  <Button className="w-full bg-white text-cyan-600 hover:bg-gray-100 rounded-2xl font-semibold">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

