"use client";

import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
  NotebookPen,
} from "lucide-react";

const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

const BookingCard = ({ room }) => {
  const [date, setDate] =
    useState("");

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [specialNote, setSpecialNote] =
    useState("");

  const [totalCost, setTotalCost] =
    useState(0);

  // Today Date
  const today = new Date()
    .toISOString()
    .split("T")[0];

  // End Time Filter
  const availableEndTimes = useMemo(() => {
    if (!startTime) return [];

    const startIndex =
      timeSlots.indexOf(startTime);

    return timeSlots.slice(startIndex + 1);
  }, [startTime]);

  // Calculate Total Cost
  useEffect(() => {
    if (startTime && endTime) {
      const start =
        Number(startTime.split(":")[0]);

      const end =
        Number(endTime.split(":")[0]);

      const totalHours = end - start;

      setTotalCost(
        totalHours * room.hourlyRate
      );
    }
  }, [startTime, endTime, room]);

  const handleBooking = (e) => {
    e.preventDefault();

    const bookingData = {
      roomId: room._id,
      roomName: room.roomName,
      date,
      startTime,
      endTime,
      totalCost,
      specialNote,
    };

    console.log(bookingData);

    alert("Booking Confirmed");
  };

  return (
    <section className="">
      <div className="bg-[#07111f] border border-cyan-500/10 rounded-3xl p-8 md:p-10 shadow-2xl">
        {/* Heading */}
        <div className="mb-10">
          <p className="uppercase tracking-[4px] text-cyan-400 text-sm mb-3">
            Booking Form
          </p>

          <h2 className="text-4xl font-extrabold text-white">
            Reserve This Study Room
          </h2>

          <p className="text-gray-400 mt-3">
            Select your preferred booking
            date and time.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleBooking}
          className="space-y-8"
        >
          {/* Date */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium">
              Booking Date
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5" />

              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                required
                className="w-full h-14 bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 text-white outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                Start Time
              </label>

              <div className="relative">
                <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <select
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(
                      e.target.value
                    );

                    setEndTime("");
                  }}
                  required
                  className="w-full h-14 bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 text-white appearance-none outline-none focus:border-cyan-400"
                >
                  <option value="">
                    Select Start Time
                  </option>

                  {timeSlots.map((slot) => (
                    <option
                      key={slot}
                      value={slot}
                    >
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* End Time */}
            <div>
              <label className="block text-gray-300 mb-3 font-medium">
                End Time
              </label>

              <div className="relative">
                <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 w-5 h-5 z-10" />

                <select
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(
                      e.target.value
                    )
                  }
                  required
                  className="w-full h-14 bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 text-white appearance-none outline-none focus:border-cyan-400"
                >
                  <option value="">
                    Select End Time
                  </option>

                  {availableEndTimes.map(
                    (slot) => (
                      <option
                        key={slot}
                        value={slot}
                      >
                        {slot}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-3xl p-8">
            <p className="text-gray-300 mb-2">
              Total Booking Cost
            </p>

            <h2 className="text-5xl font-extrabold text-cyan-400">
              ${totalCost}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              Calculated automatically
              based on booking hours.
            </p>
          </div>

          {/* Special Note */}
          <div>
            <label className="block text-gray-300 mb-3 font-medium">
              Special Note
            </label>

            <div className="relative">
              <NotebookPen className="absolute left-4 top-5 text-cyan-400 w-5 h-5" />

              <textarea
                rows={5}
                value={specialNote}
                onChange={(e) =>
                  setSpecialNote(
                    e.target.value
                  )
                }
                placeholder="Optional note..."
                className="w-full bg-[#0d1b2a] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-14 bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 rounded-2xl text-white font-bold text-lg shadow-2xl"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </section>
  );
};

export default BookingCard;