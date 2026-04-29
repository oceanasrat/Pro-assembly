import {
  Drill, Hammer, Wrench, Tv, Armchair, Dumbbell,
  Phone, Calendar, Locate
} from "lucide-react";
import { useState } from "react";

export default function Preview() {

  const [form, setForm] = useState({
    name: "",
    phone: "",
    details: "",
    address: "",
    city: "",
    zip: "",
    date: "",
    time: "",
    contactMethod: "whatsapp"
  });

  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const tools = [
    { icon: Drill, label: "Desk / Table", price: 110 },
    { icon: Hammer, label: "King Bed", price: 220 },
    { icon: Hammer, label: "Queen Bed", price: 195 },
    { icon: Wrench, label: "Chair", price: 65 },
    { icon: Tv, label: "TV Mounting", price: 140 },
    { icon: Armchair, label: "Shelving", price: 110 },
    { icon: Dumbbell, label: "Fitness Equipment", price: 130 },
    { icon: Wrench, label: "Small Fixes", price: 90 },
    { icon: Hammer, label: "Cabinets", price: 150 },
  ];

  // 💰 Pricing
  const baseTotal = selected ? selected.price * qty : 0;

  let discount = 0;
  if (qty >= 3) discount = 0.15;
  else if (qty >= 2) discount = 0.10;

  const discounted = Math.round(baseTotal * (1 - discount));

  // 🚗 Travel fee (simple + lower)
  const getTravelFee = (zip) => {
    const z = parseInt(zip);
    if (!z) return 0;

    if (z >= 75000 && z <= 75399) return 0;
    if (z >= 75400 && z <= 75999) return 15;
    if (z >= 76000 && z <= 76999) return 25;

    return 40;
  };

  const travelFee = getTravelFee(form.zip);
  const finalTotal = discounted + travelFee;

  const handleLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;

      setForm(prev => ({
        ...prev,
        address: prev.address ? `${prev.address} (${link})` : link
      }));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `New Booking Request:
Name: ${form.name}
Phone: ${form.phone}

Service: ${selected?.label}
Quantity: ${qty}

Subtotal: $${baseTotal}
Discount: ${discount * 100}%
After Discount: $${discounted}
Travel Fee: $${travelFee}

Final Total: $${finalTotal}

Details: ${form.details}

Address:
${form.address}
${form.city}, ${form.zip}

Date: ${form.date}
Time: ${form.time}
`;

    window.open(`https://wa.me/12142519820?text=${encodeURIComponent(message)}`, "_blank");

    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] bg-[#0B1020] text-white">

      {/* Header */}
      <header className="flex justify-between p-4 border-b border-white/10">
        <div className="font-bold">Pro Assembly</div>
        <a href="tel:+12142519820" className="bg-green-600 px-3 py-2 rounded flex items-center gap-2">
          <Phone className="w-4 h-4" /> Call
        </a>
      </header>

      {/* Hero */}
      <div className="p-6">
        <h1 className="text-3xl font-bold">Furniture Assembly in Dallas</h1>
        <p className="opacity-70 mt-2">Fast, reliable service</p>
      </div>

      {/* Services */}
      <div className="grid grid-cols-3 gap-3 p-4">
        {tools.map((t) => (
          <div
            key={t.label}
            onClick={() => {
              setSelected(t);
              setQty(1);
            }}
            className={`p-3 rounded-xl text-center cursor-pointer border ${
              selected?.label === t.label
                ? "bg-orange-500"
                : "border-white/10"
            }`}
          >
            <t.icon className="mx-auto mb-1" />
            <div className="text-xs">{t.label}</div>
            <div className="text-sm font-bold">${t.price}</div>
          </div>
        ))}
      </div>

      {/* Quantity */}
      {selected && (
        <div className="px-4">
          <div className="flex justify-between items-center bg-black/30 p-3 rounded">
            <span>{selected.label}</span>
            <div className="flex gap-3 items-center">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      {selected && (
        <div className="p-4 m-4 bg-black/30 rounded">
          <div>Subtotal: ${baseTotal}</div>
          <div>Discount: {discount * 100}%</div>
          <div>Travel Fee: ${travelFee}</div>
          <div className="text-green-400 font-bold text-lg">
            Total: ${finalTotal}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-3">

        <input placeholder="Name" required className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Phone" required className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <textarea placeholder="Details" className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, details: e.target.value })} />

        <input placeholder="Street Address" required className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, address: e.target.value })} />

        <div className="grid grid-cols-2 gap-2">
          <input placeholder="City" required className="p-3 bg-black/30 rounded"
            onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input placeholder="ZIP" required className="p-3 bg-black/30 rounded"
            onChange={(e) => setForm({ ...form, zip: e.target.value })} />
        </div>

        <button type="button" onClick={handleLocation} className="text-orange-400 flex gap-1">
          <Locate className="w-4 h-4" /> Use my location
        </button>

        <div className="flex items-center gap-2 bg-black/30 p-3 rounded">
          <Calendar />
          <input type="date" required className="bg-transparent w-full"
            onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>

        <div className="flex gap-2">
          {["Morning", "Afternoon", "Evening"].map((t) => (
            <button type="button" key={t}
              onClick={() => setForm({ ...form, time: t })}
              className={`flex-1 p-2 rounded ${
                form.time === t ? "bg-orange-500" : "bg-black/30"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <button className="w-full bg-orange-500 p-3 rounded font-bold">
          Submit Booking
        </button>

      </form>

    </div>
  );
}
