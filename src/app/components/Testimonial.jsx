import Image from "next/image";

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "University Student",
    image:
      "https://randomuser.me/api/portraits/women/44.jpg",
    review:
      "This platform completely changed how I study. The rooms are clean, quiet, and very comfortable.",
  },
  {
    name: "Tanvir Hasan",
    role: "Freelancer",
    image:
      "https://randomuser.me/api/portraits/men/32.jpg",
    review:
      "Perfect environment for focused work sessions. Booking is simple and the facilities are excellent.",
  },
  {
    name: "Nusrat Jahan",
    role: "Medical Student",
    image:
      "https://randomuser.me/api/portraits/women/68.jpg",
    review:
      "I love the peaceful atmosphere and high-speed internet. Great place for long study sessions.",
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[5px] text-cyan-400 font-semibold mb-4">
            Testimonials
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            What Students Say
          </h2>

          <p className="text-gray-400 text-lg mt-5 max-w-3xl mx-auto">
            Hear from students and professionals who use our study spaces
            daily.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* User */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {testimonial.name}
                  </h3>

                  <p className="text-cyan-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Review */}
              <p className="text-gray-300 leading-relaxed text-lg">
                “{testimonial.review}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;