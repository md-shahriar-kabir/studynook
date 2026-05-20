import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Image from "next/image";
import { BookingCancelAlert } from "../components/BookingCancelAlert";
import Link from "next/link";

const MyBookingPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const res = await fetch(`http://localhost:5000/booking/${user?.id}`, {
    cache: "no-store",
  });

  const bookings = await res.json();

  return (
    <section className="min-h-screen bg-[#07111f] text-white px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* Profile */}
        <div className="bg-[#0d1b2a] border border-white/10 rounded-3xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Image */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-500/20">
              <Image
                src={user?.image}
                alt={user?.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-extrabold">{user?.name}</h1>

              <p className="text-gray-400 mt-2">{user?.email}</p>
            </div>

            {/* Total */}
            <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-2xl px-6 py-4 text-center">
              <h2 className="text-3xl font-bold text-cyan-400">
                {bookings.length}
              </h2>

              <p className="text-gray-400 text-sm mt-1">Total Bookings</p>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-5xl font-extrabold">My Bookings</h2>

          <p className="text-gray-400 mt-3">Manage all your room bookings.</p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <div className="bg-[#0d1b2a] border border-white/10 rounded-3xl p-16 text-center">
            {/* Small Tag */}
            <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-4">
              No Reservations Found
            </p>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              You have no bookings yet.
            </h2>

            {/* Description */}
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed text-lg">
              Discover modern and comfortable study rooms designed for focus,
              collaboration, and productivity. Start exploring available spaces
              and book your perfect room today.
            </p>

            {/* Button */}
            <div className="mt-10">
              <Link href="/rooms">
                <button className="bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 px-8 py-4 rounded-2xl cursor-pointer text-white font-bold shadow-2xl">
                  Browse Collection
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const bookingDate = new Date(booking.date);

              const today = new Date();

              const canCancel =
                booking.status === "confirmed" && bookingDate >= today;

              return (
                <div
                  key={booking._id}
                  className="bg-[#0d1b2a] border border-white/10 rounded-3xl overflow-hidden"
                >
                  <div className="grid lg:grid-cols-3">
                    {/* Image */}
                    <div className="relative h-72 lg:h-full">
                      <Image
                        src={booking.image}
                        alt={booking.roomName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 p-8 flex flex-col justify-between">
                      {/* Top */}
                      <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div>
                          <h2 className="text-4xl font-extrabold">
                            {booking.roomName}
                          </h2>

                          <p className="text-gray-400 mt-2">{booking.floor}</p>
                        </div>

                        {/* Status */}
                        <div
                          className={`px-5 py-2 rounded-full text-sm font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {booking.status}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="grid md:grid-cols-3 gap-5 mt-10">
                        {/* Date */}
                        <div className="bg-white/5 rounded-2xl p-5">
                          <p className="text-gray-400 text-sm mb-2">
                            Booking Date
                          </p>

                          <h3 className="font-bold text-2xl">{booking.date}</h3>
                        </div>

                        {/* Time */}
                        <div className="bg-white/5 rounded-2xl p-5">
                          <p className="text-gray-400 text-sm mb-2">Time</p>

                          <h3 className="font-bold text-2xl">
                            {booking.startTime} - {booking.endTime}
                          </h3>
                        </div>

                        {/* Cost */}
                        <div className="bg-white/5 rounded-2xl p-5">
                          <p className="text-gray-400 text-sm mb-2">
                            Total Cost
                          </p>

                          <h3 className="font-bold text-2xl text-cyan-400">
                            ${booking.totalCost}
                          </h3>
                        </div>
                      </div>

                      {/* Bottom */}
                      <div className="flex items-center justify-between mt-10 flex-wrap gap-4">
                        <BookingCancelAlert bookingId={booking._id} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookingPage;
