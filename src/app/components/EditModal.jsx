"use client";
import { Button, Modal, Surface } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BiEdit } from "react-icons/bi";

const amenitiesList = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

export default function EditModal({ room }) {
  const {
    _id,
    roomName,
    description,
    image,
    floor,
    capacity,
    hourlyRate,
    amenities,
  } = room;

  const router = useRouter();

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(
        selectedAmenities.filter((item) => item !== amenity),
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
    console.log(room)

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/room/${_id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(room)
    });
    const data = await res.json()
    console.log(data)

    if (res.ok) {
      toast.success("Room added successfully");
      router.push("/rooms");
    }

    form.reset();
    setSelectedAmenities([]);

  };

  return (
    <Modal>
      <Button
        color="white"
        variant="outline"
        className="text-white font-semibold px-6"
      >
        <BiEdit />
        Edit
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Edit Room</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-6">
              <Surface variant="danger">
                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Room Name */}
                  <div>
                    <label className="block text-black mb-2 font-medium">
                      Room Name
                    </label>

                    <input
                      defaultValue={roomName}
                      type="text"
                      name="roomName"
                      required
                      placeholder="Enter room name"
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-black mb-2 font-medium">
                      Description
                    </label>

                    <textarea
                      defaultValue={description}
                      name="description"
                      required
                      rows={5}
                      placeholder="Write room description"
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-black mb-2 font-medium">
                      Image URL
                    </label>

                    <input
                      defaultValue={image}
                      type="url"
                      name="image"
                      required
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Floor + Capacity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-black mb-2 font-medium">
                        Floor
                      </label>

                      <input
                        defaultValue={floor}
                        type="text"
                        name="floor"
                        required
                        placeholder="3rd Floor"
                        className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-black mb-2 font-medium">
                        Capacity
                      </label>

                      <input
                        defaultValue={capacity}
                        type="number"
                        name="capacity"
                        required
                        placeholder="4"
                        className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Hourly Rate */}
                  <div>
                    <label className="block text-black mb-2 font-medium">
                      Hourly Rate ($)
                    </label>

                    <input
                      defaultValue={hourlyRate}
                      type="number"
                      name="hourlyRate"
                      required
                      placeholder="5"
                      className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-black mb-4 font-medium">
                      Amenities
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {amenitiesList.map((amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-xl px-4 py-3 cursor-pointer hover:bg-white/20 transition"
                        >
                          <input
                            defaultValue={amenities}
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="w-5 h-5 accent-cyan-500"
                          />

                          <span className="text-black">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <Modal.Footer>
                    <Button type="submit" slot="close">Save</Button>
                  </Modal.Footer>
                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
