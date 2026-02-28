import { motion } from "motion/react";
import { Drill, Hammer, Wrench, Tv, Armchair, Dumbbell, MapPin, ShieldCheck } from "lucide-react";

export default function Preview() {
  const tools = [
    { Icon: Drill, label: "Furniture", delay: 0 },
    { Icon: Tv, label: "TV Mount", delay: 0.1 },
    { Icon: Armchair, label: "Shelving", delay: 0.2 },
    { Icon: Dumbbell, label: "Fitness", delay: 0.3 },
    { Icon: Wrench, label: "Small Fixes", delay: 0.4 },
    { Icon: Hammer, label: "Install", delay: 0.5 },
  ];

  return (
    <div className="min-h-[80vh] bg-[color:var(--color-bg,#0B1020)] text-[color:var(--color-fg,#E6EDF3)]">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 w-full border-b border-white/10 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl grid place-items-center bg-[#0C2A4A] text-[#FF7A1A] font-black text-xl">P</div>
            <div className="font-semibold">Pro Assembly</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 opacity-90">
            <a href="#services">Services</a>
            <a href="#areas">Areas</a>
            <a href="#reviews">Reviews</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#book" className="inline-flex items-center rounded-2xl px-4 py-2 font-medium bg-[#FF7A1A] text-white">Book Now</a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 py-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Assembly you can trust in Dallas
          </h1>
          <p className="mt-4 text-lg opacity-80">
            Furniture assembly, TV mounting, shelving, and more — fast, friendly, and insured.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#book" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-[#FF7A1A] text-white font-medium hover:opacity-90">
              Book Now
            </a>
            <a href="#services" className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-white/15 font-medium">
              See Services
            </a>
          </div>
          <div className="mt-6 flex items-center gap-4 text-sm opacity-80">
            <MapPin className="h-4 w-4"/> Dallas, TX
            <ShieldCheck className="h-4 w-4"/> Insured
          </div>
        </div>

        {/* Animated Tool Grid */}
        <div className="relative h-[360px] md:h-[420px]">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#0C2A4A] to-[#091326] opacity-80"/>
          <div className="absolute inset-0 grid grid-cols-3 gap-4 p-6">
            {tools.map(({ Icon, label, delay }, i) => (
              <motion.div
                key={i}
                initial={{ y: 24, opacity: 0, scale: 0.9 }}
                animate={{ y: [24, -8, 24], opacity: 1, scale: 1 }}
                transition={{ duration: 4, delay, repeat: Infinity, ease: "easeInOut" }}
                className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-4 flex flex-col items-center justify-center text-center"
              >
                <Icon className="h-10 w-10 text-[#FF7A1A]" />
                <div className="mt-2 text-sm opacity-90">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services teaser */}
      <section id="services" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4">Popular services</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm opacity-90">
          <li className="rounded-2xl border border-white/10 p-4">IKEA & furniture assembly</li>
          <li className="rounded-2xl border border-white/10 p-4">TV mounting & cable concealment</li>
          <li className="rounded-2xl border border-white/10 p-4">Shelving & wall anchors</li>
          <li className="rounded-2xl border border-white/10 p-4">Fitness equipment setup</li>
          <li className="rounded-2xl border border-white/10 p-4">Bikes & outdoor gear</li>
          <li className="rounded-2xl border border-white/10 p-4">Door/lock fixes & small repairs</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-sm opacity-80">
        <div className="mx-auto max-w-6xl px-4">© {new Date().getFullYear()} Pro Assembly — Dallas, TX</div>
      </footer>
    </div>
  );
}
