"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const amenitiesList = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

const AddRoomPage = () => {
  const router = useRouter();

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity)
      );
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const room = {
    roomName: form.roomName.value,
    description: form.description.value,
    image: form.image.value,
    floor: form.floor.value,
    capacity: Number(form.capacity.value),
    hourlyRate: Number(form.hourlyRate.value),
    amenities: selectedAmenities,
  };

 
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(room)
    });
    const data = await res.json()

    if (res.ok) {
      toast.success("Room added successfully");
      router.push("/rooms");
    }


    form.reset();
    setSelectedAmenities([]);

    // router.push("/rooms");
  };

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/banner.png"
          alt="Background"
          fill
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Add New Study Room
            </h1>

            <p className="text-gray-300 mt-4 text-lg">
              Create and publish your study room listing for students.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-7"
          >
            {/* Room Name */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Room Name
              </label>

              <input
                type="text"
                name="roomName"
                required
                placeholder="Enter room name"
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Description
              </label>

              <textarea
                name="description"
                required
                rows={5}
                placeholder="Write room description"
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
              ></textarea>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Image URL
              </label>

              <input
                type="url"
                name="image"
                required
                placeholder="https://example.com/image.jpg"
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Floor + Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white mb-2 font-medium">
                  Floor
                </label>

                <input
                  type="text"
                  name="floor"
                  required
                  placeholder="3rd Floor"
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  required
                  placeholder="4"
                  className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-white mb-2 font-medium">
                Hourly Rate ($)
              </label>

              <input
                type="number"
                name="hourlyRate"
                required
                placeholder="5"
                className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-white mb-4 font-medium">
                Amenities
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/20 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="w-5 h-5 accent-cyan-500"
                    />

                    <span className="text-white">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 transition-all duration-300 py-4 rounded-xl text-lg font-bold text-white shadow-2xl cursor-pointer"
            >
              Add Room
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddRoomPage;