

import Image from "next/image";
import { Users, MapPin } from "lucide-react";
import EditModal from "@/app/components/EditModal";
import { DeleteRoom } from "@/app/components/DeleteRoom";
import BookingCard from "@/app/components/BookingCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const RoomDetailsPage = async ({ params }) => {
  const { id } = await params;
  // const token = await auth.api.getToken({
  //   headers: await headers()
  // })


  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room/${id}`, {
    cache: "no-store",
    // headers: {
    //   authorization: `Bearer ${token.token}`
    // }
  });

  const room = await res.json();
  console.log(room)

  return (
    <section className="min-h-screen bg-[#07111f] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Controls */}
        <div className="flex flex-wrap justify-between items-center gap-5 mb-10">
          {/* Heading */}
          <div>
            <p className="uppercase tracking-[4px] text-cyan-400 font-semibold mb-2">
              Study Room Details
            </p>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              {room.roomName}
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <EditModal room={room}/>
            <DeleteRoom room={room}/>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <div className="relative h-[965px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={room?.image}
              alt={room?.roomName}
              fill
              className="object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

            {/* Price */}
            <div className="absolute top-6 right-6 bg-cyan-500 text-white px-5 py-3 rounded-2xl text-xl font-bold shadow-xl">
              ${room.hourlyRate}/hr
            </div>
          </div>

            <BookingCard room={room}/>


          {/* Details */}
          <div>
            {/* Description */}
            <div className="bg-[#0d1b2a] border border-white/10 rounded-3xl p-6 shadow-xl">
              <h2 className="text-3xl font-bold text-white mb-3">
                Description
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                {room.description}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-5 mt-8">
              {/* Floor */}
              <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="text-cyan-400" />

                  <h3 className="text-xl font-bold text-white">
                    Floor
                  </h3>
                </div>

                <p className="text-gray-300 text-lg">
                  {room.floor}
                </p>
              </div>

              {/* Capacity */}
              <div className="bg-[#0d1b2a] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="text-cyan-400" />

                  <h3 className="text-xl font-bold text-white">
                    Capacity
                  </h3>
                </div>

                <p className="text-gray-300 text-lg">
                  {room.capacity} People
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-[#0d1b2a] border border-white/10 rounded-3xl p-8 shadow-xl mt-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Amenities
              </h2>

              <div className="flex flex-wrap gap-4">
                {room.amenities?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-cyan-500/15 border border-cyan-400/20 text-cyan-300 px-5 py-3 rounded-2xl font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomDetailsPage;