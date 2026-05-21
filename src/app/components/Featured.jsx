import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  Users,
  MapPin,
} from "lucide-react";

const Featured = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/room`,
    {
      cache: "no-store",
    },
  );

  const rooms =
    await res.json();

  const featuredRooms =
    rooms.slice(0, 4);

  return (
    <section className="bg-[#07111f] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <p className="uppercase tracking-[5px] text-cyan-400 text-sm font-semibold mb-3">
              Featured Spaces
            </p>

            <h2 className="text-5xl font-black text-white leading-tight">
              Featured Study Rooms
            </h2>

            <p className="text-gray-400 mt-5 text-lg max-w-2xl">
              Explore our most popular
              and highly rated study
              spaces designed for
              productivity, comfort,
              and collaboration.
            </p>
          </div>

          <Link href="/rooms">
            <button className="group bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-7 py-4 rounded-2xl text-white font-bold flex items-center gap-3 shadow-[0_10px_40px_rgba(6,182,212,0.35)]">
              View All Rooms

              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {featuredRooms.map(
            (room) => (
              <div
                key={room._id}
                className="group bg-[#0d1b2a] border border-white/10 rounded-[30px] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={
                      room.image
                    }
                    alt={
                      room.roomName
                    }
                    fill
                    className="object-cover group-hover:scale-110 transition duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Price */}
                  <div className="absolute top-4 right-4 bg-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    $
                    {
                      room.hourlyRate
                    }
                    /hr
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-2xl font-extrabold text-white mb-3 line-clamp-1">
                    {
                      room.roomName
                    }
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed line-clamp-2">
                    {
                      room.description
                    }
                  </p>

                  {/* Info */}
                  <div className="flex items-center justify-between mt-6">
                    {/* Floor */}
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4 text-cyan-400" />

                      <span className="text-sm">
                        {
                          room.floor
                        }
                      </span>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4 text-cyan-400" />

                      <span className="text-sm">
                        {
                          room.capacity
                        }{" "}
                        People
                      </span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    {room?.amenities
                      ?.slice(0, 3)
                      .map(
                        (
                          amenity,
                          index,
                        ) => (
                          <span
                            key={
                              index
                            }
                            className="bg-cyan-500/10 border border-cyan-400/10 text-cyan-300 text-xs px-3 py-2 rounded-full"
                          >
                            {
                              amenity
                            }
                          </span>
                        ),
                      )}
                  </div>

                  {/* Button */}
                  <Link
                    href={`/rooms/${room._id}`}
                  >
                    <button className="w-full mt-7 bg-white/5 hover:bg-cyan-500 transition-all duration-300 border border-white/10 hover:border-cyan-500 py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-3 group cursor-pointer">
                      View Details

                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default Featured;