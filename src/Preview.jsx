import {
  Drill, Hammer, Wrench, Tv, Armchair, Dumbbell,
  MapPin, ShieldCheck, Phone, Calendar, Clock, Locate
} from "lucide-react";
import { useState } from "react";

export default function Preview() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    details: "",
    address: "",
    date: "",
    time: "",
    contactMethod: "whatsapp"
  });

  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tools = [
    { icon: Drill, label: "Furniture Assembly" },
    { icon: Tv, label: "TV Mounting" },
    { icon: Armchair, label: "Shelving" },
    { icon: Dumbbell, label: "Fitness Equipment" },
    { icon: Wrench, label: "Small Fixes" },
    { icon: Hammer, label: "Installation" },
  ];

  const handleLocation = () => {
    if (!navigator.geolocation) return;

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        setForm({ ...form, address: coords });
        setLoadingLocation(false);
      },
      () => {
        alert("Could not get location");
        setLoadingLocation(false);
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `New Booking Request:
Name: ${form.name}
Phone: ${form.phone}
Service: ${form.service}
Details: ${form.details}
Address: ${form.address}
Date: ${form.date}
Time: ${form.time}
`;

    const phoneNumber = "12142519820";

    if (form.contactMethod === "whatsapp") {
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }

    if (form.contactMethod === "call") {
      window.location.href = `tel:${phoneNumber}`;
    }

    if (form.contactMethod === "sms") {
      window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] bg-[#0B1020] text-[#E6EDF3]">

      {/* Header */}
      <header className="sticky top-0 z-10 w-full border-b border-white/10 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-4 py-3 flex justify-between">

          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl grid place-items-center bg-[#0C2A4A] text-[#FF7A1A] font-black">
              P
            </div>
            <div className="font-semibold">Pro Assembly</div>
          </div>

          <a href="tel:+12142519820" className="bg-green-600 px-4 py-2 rounded-xl flex items-center gap-2">
            <Phone className="w-4 h-4" /> Call Now
          </a>

        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">

        <div>
          <h1 className="text-4xl font-extrabold">
            Furniture Assembly in Dallas, TX
          </h1>

          <p className="mt-4 opacity-80">
            Fast, reliable assembly, TV mounting & home setup.
          </p>

          <div className="mt-6 space-y-1 text-sm opacity-80">
            <div>✔ Same-day service</div>
            <div>✔ Fast response</div>
            <div>✔ Dallas & nearby</div>
          </div>
        </div>

        {/* Clickable Services */}
        <div className="grid grid-cols-3 gap-4">
          {tools.map(({ icon: Icon, label }) => (
            <div
              key={label}
              onClick={() => setForm({ ...form, service: label })}
              className={`p-4 rounded-xl border text-center cursor-pointer ${
                form.service === label
                  ? "bg-[#FF7A1A] text-white"
                  : "border-white/10"
              }`}
            >
              <Icon className="mx-auto mb-2" />
              <div className="text-sm">{label}</div>
            </div>
          ))}
        </div>

      </section>

      {/* Booking */}
      <section className="max-w-2xl mx-auto px-4 pb-16">

        <h2 className="text-2xl font-bold mb-4">Book Your Service</h2>

        {submitted && (
          <div className="bg-green-600 p-3 rounded-xl mb-4">
            ✅ Request sent! We’ll contact you shortly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            placeholder="Your Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          <input
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          <textarea
            placeholder="Describe your job..."
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          />

          {/* Location */}
          <div className="flex gap-2">
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
            />
            <button
              type="button"
              onClick={handleLocation}
              className="px-3 bg-[#FF7A1A] rounded-xl"
            >
              <Locate />
            </button>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 p-3 border rounded-xl border-white/10">
            <Calendar />
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-transparent w-full"
            />
          </div>

          {/* Time */}
          <div className="flex gap-2">
            {["Morning", "Afternoon", "Evening"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, time: t })}
                className={`flex-1 p-2 rounded-xl border ${
                  form.time === t ? "bg-[#FF7A1A]" : "border-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Contact */}
          <select
            value={form.contactMethod}
            onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}
            className="w-full p-3 rounded-xl bg-black/30 border border-white/10"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Call Me</option>
            <option value="sms">Text Me</option>
          </select>

          <button className="w-full bg-[#FF7A1A] py-3 rounded-xl font-bold">
            Submit Booking
          </button>

        </form>
      </section>

      <footer className="text-center py-6 text-sm opacity-70">
        © {new Date().getFullYear()} Pro Assembly
      </footer>

    </div>
  );
}
