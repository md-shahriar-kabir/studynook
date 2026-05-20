"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:5000/room");
        const data = await res.json();

        setRooms(data);
        setFilteredRooms(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Search + Filter
  useEffect(() => {
    let updatedRooms = [...rooms];

    // Search
    if (searchText) {
      updatedRooms = updatedRooms.filter((room) =>
        room.roomName
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    // Capacity Filter
    if (filterCapacity) {
      updatedRooms = updatedRooms.filter(
        (room) => room.capacity >= Number(filterCapacity)
      );
    }

    setFilteredRooms(updatedRooms);
  }, [searchText, filterCapacity, rooms]);

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/banner.png"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="uppercase tracking-[5px] text-cyan-400 font-semibold mb-4">
            Find Your Perfect Space
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            All Study Rooms
          </h1>

          <p className="text-gray-300 text-lg mt-5 max-w-3xl mx-auto">
            Browse modern, quiet, and comfortable study rooms for solo
            work, group discussions, and productive learning sessions.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-14 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Search */}
            <input
              type="text"
              placeholder="Search room name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            {/* Filter */}
            <select
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option
                value=""
                className="bg-gray-900"
              >
                Filter By Capacity
              </option>

              <option
                value="1"
                className="bg-gray-900"
              >
                1+ People
              </option>

              <option
                value="4"
                className="bg-gray-900"
              >
                4+ People
              </option>

              <option
                value="8"
                className="bg-gray-900"
              >
                8+ People
              </option>

              <option
                value="10"
                className="bg-gray-900"
              >
                10+ People
              </option>
            </select>

            {/* Reset */}
            <button
              onClick={() => {
                setSearchText("");
                setFilterCapacity("");
              }}
              className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 rounded-2xl text-white font-bold text-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-[40vh]">
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          /* No Rooms */
          <div className="flex items-center justify-center h-[40vh]">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                No Rooms Found
              </h2>

              <p className="text-gray-300">
                Try changing your search or filter options.
              </p>
            </div>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className="group bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={room.image}
                    alt={room.roomName}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* Price */}
                  <div className="absolute top-4 right-4 bg-cyan-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg">
                    ${room.hourlyRate}/hr
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="text-xl font-bold text-white">
                      {room.roomName}
                    </h2>

                    <span className="bg-white/10 text-cyan-300 text-sm px-4 py-1 rounded">
                      {room.capacity} People
                    </span>
                  </div>

                  <p className="text-gray-300 mt-4 line-clamp-3 leading-relaxed truncate">
                    {room.description}
                  </p>

                  {/* Floor */}
                  <div className="mt-5 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">
                        Location
                      </p>

                      <p className="text-white font-medium">
                        {room.floor}
                      </p>
                    </div>

                    <div className="bg-white/10 px-4 py-2 rounded-xl">

                      <p className="text-green-400 font-semibold">
                        Available
                      </p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {room.amenities?.slice(0, 3).map((item, index) => (
                      <span
                        key={index}
                        className="bg-cyan-500/20 text-cyan-300 text-sm px-3 py-2 rounded-xl border border-cyan-500/20"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <Link href={`/rooms/${room._id}`}>
                    <button className="w-full mt-7 bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-4 rounded-2xl text-white font-bold text-lg shadow-xl cursor-pointer">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomsPage;