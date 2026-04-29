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
    { icon: Drill, label: "Outdoor Furniture", price: 140 },
    { icon: Hammer, label: "Pool Table", price: 220 },
  ];

  const toggleService = (service) => {
    const exists = selectedServices.find(s => s.label === service.label);

    if (exists) {
      setSelectedServices(selectedServices.filter(s => s.label !== service.label));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // 💰 Base total
  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);

  // 🎯 Discount
  let discount = 0;
  if (selectedServices.length >= 3) discount = 0.15;
  else if (selectedServices.length >= 2) discount = 0.10;

  const discountedTotal = Math.round(total * (1 - discount));

  // 🚗 Travel Fee (ZIP based logic)
  const getTravelFee = (zip) => {
    if (!zip) return 0;

    const zipNum = parseInt(zip);

    // Dallas core ZIPs ~75000–75399
    if (zipNum >= 75000 && zipNum <= 75399) return 0;

    if (zipNum >= 75400 && zipNum <= 75999) return 25;
    if (zipNum >= 76000 && zipNum <= 76999) return 40;

    return 60;
  };

  const travelFee = getTravelFee(form.zip);

  const finalTotal = discountedTotal + travelFee;

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

    const servicesList = selectedServices
      .map(s => `${s.label} - $${s.price}`)
      .join("\n");

    const message = `New Booking Request:
Name: ${form.name}
Phone: ${form.phone}

Services:
${servicesList}

Subtotal: $${total}
Discount: ${discount * 100}%
After Discount: $${discountedTotal}
Travel Fee: $${travelFee}

Final Total: $${finalTotal}

Address:
${form.address}
${form.city}, ${form.zip}

Date: ${form.date}
Time: ${form.time}
`;

    const phoneNumber = "12142519820";

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");

    setSubmitted(true);
  };

  return (
    <div className="bg-[#0B1020] text-white min-h-screen">

      <div className="p-4 text-xl font-bold">Pro Assembly</div>

      {/* Services */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {services.map((s) => {
          const selected = selectedServices.find(x => x.label === s.label);

          return (
            <div
              key={s.label}
              onClick={() => toggleService(s)}
              className={`p-4 rounded-xl cursor-pointer text-center border ${
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

      {/* Pricing Summary */}
      <div className="p-4 bg-black/30 m-4 rounded-xl space-y-1">
        <div>Subtotal: ${total}</div>
        <div>Discount: {discount * 100}%</div>
        <div>After Discount: ${discountedTotal}</div>
        <div>Travel Fee: ${travelFee}</div>
        <div className="font-bold text-green-400 text-lg">
          Final: ${finalTotal}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-3">

        <input
          placeholder="Name"
          required
          className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Phone"
          required
          className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Street Address"
          required
          className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            placeholder="City"
            required
            className="p-3 bg-black/30 rounded"
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            placeholder="ZIP"
            required
            className="p-3 bg-black/30 rounded"
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
          />
        </div>

        <button type="button" onClick={handleLocation} className="text-sm text-orange-400 flex items-center gap-1">
          <Locate className="w-4 h-4" /> Use my location
        </button>

        <input
          type="date"
          required
          className="w-full p-3 bg-black/30 rounded"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <button className="w-full bg-orange-500 p-3 rounded font-bold">
          Submit Booking
        </button>

      </form>

    </div>
  );
}
