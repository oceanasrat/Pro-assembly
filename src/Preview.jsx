import {
  Drill, Hammer, Wrench, Tv, Armchair, Dumbbell,
  Phone, Calendar, Locate
} from "lucide-react";
import { useState } from "react";

export default function Preview() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    details: "",
    address: "",
    city: "",
    zip: "",
    date: "",
    time: "",
    contactMethod: "whatsapp"
  });

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const tools = [
    { icon: Drill, label: "Desk / Table", price: 69 },
    { icon: Hammer, label: "Bed Frame", price: 79 },
    { icon: Wrench, label: "Chair", price: 49 },
    { icon: Tv, label: "TV Stand", price: 89 },
    { icon: Armchair, label: "Bookcase", price: 79 },
    { icon: Dumbbell, label: "Fitness Equipment", price: 85 },
    { icon: Hammer, label: "Outdoor Furniture", price: 89 },
    { icon: Wrench, label: "Cabinets", price: 89 },
    { icon: Armchair, label: "Couch", price: 85 },
    { icon: Drill, label: "Crib", price: 79 },
    { icon: Wrench, label: "Shelves", price: 75 },
    { icon: Hammer, label: "Pool Table", price: 159 },
  ];

  const handleLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

      setForm((prev) => ({
        ...prev,
        address: prev.address
          ? `${prev.address} (${mapsLink})`
          : mapsLink
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const discounted = selectedPrice
      ? Math.round(selectedPrice * 0.9)
      : "";

    const message = `New Booking Request:
Name: ${form.name}
Phone: ${form.phone}
Service: ${form.service}

Price:
Original: $${selectedPrice}
Discounted: $${discounted}

Details: ${form.details}

Address:
${form.address}
${form.city}, ${form.zip}

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
      <header className="flex justify-between p-4 border-b border-white/10">
        <div className="font-bold">Pro Assembly</div>
        <a href="tel:+12142519820" className="bg-green-600 px-3 py-2 rounded-lg flex items-center gap-2">
          <Phone className="w-4 h-4" /> Call
        </a>
      </header>

      {/* Hero */}
      <div className="p-6">
        <h1 className="text-3xl font-bold">Furniture Assembly in Dallas</h1>
        <p className="opacity-70 mt-2">Fast, affordable, same-day service</p>
      </div>

      {/* Services */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {tools.map(({ icon: Icon, label, price }) => {
          const discounted = Math.round(price * 0.9);

          return (
            <div
              key={label}
              onClick={() => {
                setForm({ ...form, service: label });
                setSelectedPrice(price);
              }}
              className={`p-4 rounded-xl border cursor-pointer text-center ${
                form.service === label
                  ? "bg-[#FF7A1A] text-white"
                  : "border-white/10"
              }`}
            >
              <Icon className="mx-auto mb-2" />
              <div className="text-sm font-semibold">{label}</div>

              <div className="line-through text-xs opacity-60">
                ${price}
              </div>
              <div className="text-green-400 font-bold">
                ${discounted}
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking */}
      <div className="p-4">

        <div className="bg-[#FF7A1A] p-2 rounded-lg text-center mb-4">
          🎉 First-time customers get 10% OFF
        </div>

        {submitted && (
          <div className="bg-green-600 p-2 rounded mb-3 text-center">
            ✅ Request sent!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 rounded bg-black/30"
          />

          <input
            placeholder="Phone"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full p-3 rounded bg-black/30"
          />

          <textarea
            placeholder="Details"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="w-full p-3 rounded bg-black/30"
          />

          {/* Address */}
          <input
            placeholder="Street Address"
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full p-3 rounded bg-black/30"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              placeholder="City"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="p-3 rounded bg-black/30"
            />
            <input
              placeholder="ZIP"
              required
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              className="p-3 rounded bg-black/30"
            />
          </div>

          <button type="button" onClick={handleLocation} className="text-sm text-orange-400 flex items-center gap-1">
            <Locate className="w-4 h-4" /> Use my location
          </button>

          {/* Date */}
          <div className="flex items-center gap-2 bg-black/30 p-3 rounded">
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
                className={`flex-1 p-2 rounded ${
                  form.time === t ? "bg-orange-500" : "bg-black/30"
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
            className="w-full p-3 rounded bg-black/30"
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="call">Call</option>
            <option value="sms">SMS</option>
          </select>

          <button className="w-full bg-[#FF7A1A] py-3 rounded font-bold">
            Submit Booking
          </button>

        </form>
      </div>

    </div>
  );
}
