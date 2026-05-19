import {
  Wifi,
  ShieldCheck,
  LampDesk,
  Users,
} from "lucide-react";

const features = [
  {
    title: "High-Speed Wi-Fi",
    description:
      "Enjoy uninterrupted internet access for online classes, research, and meetings.",
    icon: Wifi,
  },
  {
    title: "Quiet Environment",
    description:
      "Study in peaceful and distraction-free spaces designed for deep focus.",
    icon: LampDesk,
  },
  {
    title: "Secure Booking",
    description:
      "Book study rooms safely with trusted listings and secure reservations.",
    icon: ShieldCheck,
  },
  {
    title: "Group Friendly",
    description:
      "Find rooms suitable for team discussions, workshops, and collaborative learning.",
    icon: Users,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="relative py-24 bg-[#07111f] overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[5px] text-cyan-400 font-semibold mb-4">
            Why Choose Us
          </p>

          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Designed For Modern Students
          </h2>

          <p className="text-gray-300 text-lg mt-5 max-w-3xl mx-auto leading-relaxed">
            Experience premium study environments with modern facilities,
            comfortable seating, and productivity-focused spaces.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-[#0d1b2a] border border-cyan-500/10 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.4)] hover:border-cyan-400/30"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 flex items-center justify-center mb-6 border border-cyan-400/10">
                  <Icon className="text-cyan-400 w-8 h-8" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;