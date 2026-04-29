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
    contactMethod: "whatsapp"
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const services = [
    { icon: Drill, label: "Desk / Table", price: 110 },
    { icon: Hammer, label: "King Bed", price: 220 },
    { icon: Hammer, label: "Queen Bed", price: 195 },
    { icon: Wrench, label: "Chair", price: 65 },
    { icon: Tv, label: "TV Stand", price: 140 },
    { icon: Armchair, label: "Bookcase", price: 120 },
    { icon: Dumbbell, label: "Dresser", price: 130 },
    { icon: Armchair, label: "Couch", price: 140 },
    { icon: Wrench, label: "Shelves", price: 110 },
    { icon: Hammer, label: "Cabinets", price: 150 },
  ];

  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.label === service.label);

    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.label !== service.label));
    } else {
      setSelectedServices([...selectedServices, { ...service, qty: 1 }]);
    }
  };

  const updateQty = (label, qty) => {
    setSelectedServices(prev =>
      prev.map(s =>
        s.label === label ? { ...s, qty: Math.max(1, qty) } : s
      )
    );
  };

  const total = selectedServices.reduce(
    (sum, s) => sum + s.price * s.qty,
    0
  );

  const itemCount = selectedServices.reduce(
    (sum, s) => sum + s.qty,
    0
  );

  let discount = 0;
  if (itemCount >= 4) discount = 0.15;
  else if (itemCount >= 2) discount = 0.10;

  const discountedTotal = Math.round(total * (1 - discount));

  const getTravelFee = (zip) => {
    if (!zip) return 0;
    const z = parseInt(zip);

    if (z >= 75000 && z <= 75399) return 0;
    if (z >= 75400 && z <= 75999) return 15;
    if (z >= 76000 && z <= 76999) return 25;

    return 40;
  };

  const travelFee = getTravelFee(form.zip);
  const finalTotal = discountedTotal + travelFee;

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

  // FIXED: works with sticky button
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const servicesList = selectedServices
      .map(s => `${s.label} x${s.qty} - $${s.price * s.qty}`)
      .join("\n");

    const message = `New Booking Request:
Name: ${form.name}
Phone: ${form.phone}

Services:
${servicesList}

Items: ${itemCount}
Subtotal: $${total}
Discount: ${discount * 100}%
After Discount: $${discountedTotal}
Travel Fee: $${travelFee}

Final Total: $${finalTotal}

Address:
${form.address}
${form.city}, ${form.zip}

Date: ${form.date}
`;

    window.open(`https://wa.me/12142519820?text=${encodeURIComponent(message)}`, "_blank");

    setSubmitted(true);
  };

  return (
    <div className="bg-[#0B1020] text-white min-h-screen pb-32">

      <div className="p-4 text-xl font-bold">Pro Assembly</div>

      {/* Services */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {services.map((s) => {
          const selected = selectedServices.find(x => x.label === s.label);

          return (
            <div
              key={s.label}
              onClick={() => toggleService(s)}
              className={`p-4 rounded-xl border text-center cursor-pointer ${
                selected ? "bg-orange-500" : "border-white/10"
              }`}
            >
              <s.icon className="mx-auto mb-2" />
              <div>{s.label}</div>
              <div className="font-bold">${s.price}</div>
            </div>
          );
        })}
      </div>

      {/* Quantity */}
      <div className="px-4 space-y-2">
        {selectedServices.map((s) => (
          <div key={s.label} className="flex justify-between items-center bg-black/30 p-2 rounded">
            <div>{s.label}</div>
            <div className="flex gap-2 items-center">
              <button onClick={() => updateQty(s.label, s.qty - 1)}>-</button>
              <span>{s.qty}</span>
              <button onClick={() => updateQty(s.label, s.qty + 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 bg-black/30 m-4 rounded-xl">
        <div>Items: {itemCount}</div>
        <div>Subtotal: ${total}</div>
        <div>Discount: {discount * 100}%</div>
        <div>Travel Fee: ${travelFee}</div>
        <div className="text-green-400 font-bold text-lg">
          Final: ${finalTotal}
        </div>
      </div>

      {/* Form */}
      <form className="p-4 space-y-3">

        <input placeholder="Name" required className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <input placeholder="Phone" required className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

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

      </form>

      {/* ✅ Sticky Submit Button */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0B1020] border-t border-white/10 p-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 p-4 rounded-xl font-bold text-lg"
        >
          Submit Booking (${finalTotal})
        </button>
      </div>

    </div>
  );
}
