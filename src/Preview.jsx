import { Drill, Hammer, Wrench, Tv, Armchair, Dumbbell, MapPin, ShieldCheck, Phone } from "lucide-react";
import { useState } from "react";

export default function Preview() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    details: "",
    address: "",
    time: "",
    contactMethod: "whatsapp"
  });

  const tools = [
    { Icon: Drill, label: "Furniture" },
    { Icon: Tv, label: "TV Mount" },
    { Icon: Armchair, label: "Shelving" },
    { Icon: Dumbbell, label: "Fitness" },
    { Icon: Wrench, label: "Small Fixes" },
    { Icon: Hammer, label: "Install" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `New Booking Request:
Name: ${form.name}
Phone: ${form.phone}
Service: ${form.service}
Details: ${form.details}
Address: ${form.address}
Preferred Time: ${form.time}
`;

    const phoneNumber = "12142519820"; // your number

    // Google Ads conversion tracking
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-XXXXXXXXX/XXXXXXXX"
      });
    }

    if (form.contactMethod === "whatsapp") {
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    }

    if (form.contactMethod === "call") {
      window.location.href = `tel:${phoneNumber}`;
    }

    if (form.contactMethod === "sms") {
      window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    }
  };

  return (
    <div className="min-h-[80vh] bg-[#0B1020] text-[#E6EDF3]">

      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-white/10 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl grid place-items-center bg-[#0C2A4A] text-[#FF7A1A] font-black text-xl">
              P
            </div>
            <div className="font-semibold">Pro Assembly</div>
          </div>

          <a 
            href="tel:+12142519820"
            className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-green-600 text-white font-medium"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>

        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 py-16">

        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Furniture Assembly in Dallas, TX
          </h1>

          <p className="mt-4 text-lg opacity-80">
            Fast, reliable furniture assembly, TV mounting, and home setup services.
            Same-day availability.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#book" className="rounded-2xl px-5 py-3 bg-[#FF7A1A] text-white font-medium">
              Book Now
            </a>
          </div>

          {/* Trust Boost */}
          <div className="mt-6 text-sm opacity-80 space-y-1">
            <div>✔ Same-day service available</div>
            <div>✔ Fast response (under 10 min)</div>
            <div>✔ Serving Dallas & nearby areas</div>
          </div>

          <div className="mt-6 flex items-center gap-4 text-sm opacity-80">
            <MapPin className="h-4 w-4" /> Dallas, TX
            <ShieldCheck className="h-4 w-4" /> Insured
          </div>
        </div>

        {/* Services */}
        <div className="grid grid-cols-3 gap-4">
          {tools.map(({ Icon, label }, i) => (
            <div key={i} className="rounded-2xl border border-white/10 p-4 text-center">
              <Icon className="h-8 w-8 mx-auto text-[#FF7A1A]" />
              <div className="mt-2 text-sm">{label}</div>
            </div>
          ))}
        </div>

      </section>

      {/* Booking Form */}
      <section id="book" className="mx-auto max-w-2xl px-4 pb-16">
        <h2 className="text-2xl font-bold mb-4">Book Your Service</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          <input
            type="tel"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          <select
            required
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          >
            <option value="">Select Service</option>
            <option>Furniture Assembly</option>
            <option>TV Mounting</option>
            <option>Shelving</option>
            <option>Fitness Equipment</option>
            <option>General Installation</option>
          </select>

          <textarea
            placeholder="Describe what you need (items, size, brand...)"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          <input
            type="text"
            placeholder="Your Address / Area"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          <input
            type="datetime-local"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          <select
            value={form.contactMethod}
            onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Call Me</option>
            <option value="sms">Text Me</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#FF7A1A] font-bold"
          >
            Submit Booking
          </button>

        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 text-sm opacity-80 text-center">
        © {new Date().getFullYear()} Pro Assembly — Dallas, TX
      </footer>

    </div>
  );
}
