import {
  Drill, Hammer, Wrench, Tv, Armchair, Dumbbell,
  Calendar, Locate, ShieldCheck, Star, Zap, CheckCircle2,
  PhoneCall, ThumbsUp, Clock, Package
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
    contactMethod: ""
  });

  const [selectedServices, setSelectedServices] = useState([]);

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

  const total = selectedServices.reduce((sum, s) => sum + s.price * s.qty, 0);
  const itemCount = selectedServices.reduce((sum, s) => sum + s.qty, 0);

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
  const phoneNumber = "12142519820";

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      const link = `https://www.google.com/maps/search/?api=1&query=${pos.coords.latitude},${pos.coords.longitude}`;
      setForm(prev => ({
        ...prev,
        address: prev.address ? `${prev.address} (${link})` : link
      }));
    }, () => {
      alert("Unable to retrieve your location. Please enter it manually.");
    });
  };

  const scrollToForm = () => {
    document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert("Please select at least one service to continue.");
      return;
    }

    if (!form.contactMethod) {
      alert("Please choose how you want us to contact you.");
      return;
    }

    const servicesList = selectedServices
      .map(s => `${s.label} x${s.qty} - $${s.price * s.qty}`)
      .join("\n");

    const message = `New Booking Request:
Name: ${form.name}
Phone: ${form.phone}

Services:
${servicesList}

Details:
${form.details || "None provided"}

Subtotal: $${total}
Discount Applied: ${discount * 100}%
Travel Fee: $${travelFee}
Total: $${finalTotal}

Address:
${form.address}
${form.city}, ${form.zip}

Date: ${form.date}
Contact Preference: ${form.contactMethod.toUpperCase()}
`;

    if (form.contactMethod === "whatsapp") {
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
    if (form.contactMethod === "call") {
      window.location.href = `tel:${phoneNumber}`;
    }
    if (form.contactMethod === "sms") {
      window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
    }
  };

  return (
    <div className="bg-[#0B1020] text-white min-h-screen pb-32 font-sans selection:bg-orange-500/30">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#0B1020]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center shadow-md">
        <div className="font-extrabold text-xl tracking-tight text-white">Pro <span className="text-orange-500">Assembly</span></div>
        <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm font-bold border border-orange-500/20 active:bg-orange-500/20">
          <PhoneCall className="w-4 h-4" /> Call Now
        </a>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-500/10 to-[#0B1020] pt-10 pb-8 px-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-green-500/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Available Today
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
          Professional Furniture Assembly in Rowlett & DFW
        </h1>
        <p className="text-orange-400 font-bold text-lg mb-4">Fast. Insured. Stress-Free.</p>
        
        <p className="text-white/70 text-sm md:text-base max-w-md mx-auto mb-6 leading-relaxed">
          Skip the headaches and confusing manuals. Our expert technicians provide flat-pack assembly with same-day availability and a free, instant quote.
        </p>

        <button 
          onClick={scrollToForm}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] w-full max-w-xs transition-all active:scale-95"
        >
          Get Free Quote
        </button>
      </div>

      {/* Trust & Benefits Section */}
      <div className="px-4 py-6 space-y-6 border-b border-white/10 bg-white/5">
        
        {/* Social Proof */}
        <div className="bg-[#0B1020] border border-white/10 p-4 rounded-xl text-center shadow-lg">
          <div className="flex justify-center gap-1 mb-2">
            {.map(i => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="italic text-white/80 text-sm mb-2">"Saved my entire weekend! They arrived on time, built my entire bedroom set in 2 hours, and took all the trash."</p>
          <div className="text-xs text-white/50 font-bold uppercase tracking-wider">— Verified Customer</div>
        </div>

        {/* Benefits Bullet Points */}
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-orange-400 shrink-0" />
            <span className="text-sm font-medium">Flat-pack & IKEA Experts</span>
          </div>
          <div className="flex items-center gap-3">
            <ThumbsUp className="w-6 h-6 text-orange-400 shrink-0" />
            <span className="text-sm font-medium">100% Satisfaction Guarantee</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-orange-400 shrink-0" />
            <span className="text-sm font-medium">Fully Insured & Affordable Rates</span>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent p-5 rounded-xl border border-orange-500/20">
          <h3 className="font-bold text-orange-400 mb-4 flex items-center gap-2"><Clock className="w-5 h-5"/> How It Works</h3>
          <ol className="space-y-3 relative border-l border-white/10 ml-2.5">
            <li className="pl-6 relative">
              <span className="absolute -left-2.5 top-0 bg-[#0B1020] border border-orange-500 text-orange-500 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <div className="font-bold text-sm">Select Your Items</div>
              <div className="text-xs text-white/60">Choose your furniture below for an instant quote.</div>
            </li>
            <li className="pl-6 relative">
              <span className="absolute -left-2.5 top-0 bg-[#0B1020] border border-orange-500 text-orange-500 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <div className="font-bold text-sm">We Confirm Details</div>
              <div className="text-xs text-white/60">We review your job and confirm the schedule.</div>
            </li>
            <li className="pl-6 relative">
              <span className="absolute -left-2.5 top-0 bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <div className="font-bold text-sm">Assembly Done</div>
              <div className="text-xs text-white/60">Sit back and relax while we build.</div>
            </li>
          </ol>
        </div>

      </div>

      <form id="booking-section" onSubmit={handleSubmit} className="pt-4">
        {/* Services Selection */}
        <div className="p-4 pt-6">
          <h2 className="text-xl font-bold mb-1">Build Your Quote</h2>
          <p className="text-sm text-white/60 mb-4">Select the items you need assembled below.</p>
          
          <div className="grid grid-cols-2 gap-3">
            {services.map((s) => {
              const selected = selectedServices.find(x => x.label === s.label);
              return (
                <div
                  key={s.label}
                  onClick={() => toggleService(s)}
                  className={`p-4 rounded-xl border text-center cursor-pointer transition-all active:scale-95 ${
                    selected 
                    ? "bg-orange-500 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <s.icon className={`mx-auto mb-2 w-7 h-7 ${selected ? "text-white" : "text-white/60"}`} />
                  <div className="text-sm font-medium">{s.label}</div>
                  <div className={`font-bold mt-1 ${selected ? "text-white" : "text-orange-400"}`}>${s.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantities */}
        {selectedServices.length > 0 && (
          <div className="px-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            {selectedServices.map((s) => (
              <div key={s.label} className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-lg">
                <div className="font-medium">{s.label}</div>
                <div className="flex gap-4 items-center bg-[#0B1020] px-3 py-1 rounded-md border border-white/10">
                  <button type="button" onClick={() => updateQty(s.label, s.qty - 1)} className="text-xl text-white/60 hover:text-white px-2">-</button>
                  <span className="font-bold min-w-[20px] text-center">{s.qty}</span>
                  <button type="button" onClick={() => updateQty(s.label, s.qty + 1)} className="text-xl text-white/60 hover:text-white px-2">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Summary */}
        <div className="m-4 p-5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl space-y-2 shadow-lg">
          <div className="flex justify-between text-sm text-white/70">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-400 font-medium">
              <span>Multi-Item Discount ({discount * 100}%)</span>
              <span>-${total - discountedTotal}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm text-white/70">
            <span>Travel Fee (Calculated via ZIP)</span>
            <span>${travelFee}</span>
          </div>
          
          <div className="pt-3 mt-3 border-t border-white/10 flex justify-between items-center">
            <span className="font-bold text-lg">Total Quote</span>
            <span className="text-orange-400 font-extrabold text-2xl">${finalTotal}</span>
          </div>
        </div>

        {/* Customer Details Form */}
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-orange-500" />
            Final Details
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Full Name" required className="w-full p-3.5 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-lg transition-colors"
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Phone Number" required type="tel" className="w-full p-3.5 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-lg transition-colors"
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <textarea
            placeholder="Describe your job (brand, access instructions, elevators?)"
            value={form.details}
            rows={3}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="w-full p-3.5 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-lg transition-colors resize-none"
          />

          <div className="relative">
            <input placeholder="Street Address" required value={form.address} className="w-full p-3.5 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-lg transition-colors pr-12"
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button type="button" onClick={handleLocation} title="Use Current Location" className="absolute right-3 top-3.5 text-orange-400 hover:text-orange-300 p-1 bg-orange-400/10 rounded">
              <Locate className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" required className="p-3.5 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-lg transition-colors"
              onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="ZIP Code" required type="number" className="p-3.5 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-lg transition-colors"
              onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1 rounded-lg focus-within:border-orange-500 transition-colors">
            <div className="pl-3 text-white/50"><Calendar className="w-5 h-5" /></div>
            <input type="date" required className="bg-transparent w-full p-2.5 outline-none text-white color-scheme-dark"
              onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>

          <select
            required
            value={form.contactMethod}
            onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}
            className="w-full p-3.5 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-lg transition-colors appearance-none"
          >
            <option value="" disabled className="bg-[#0B1020]">Choose how we contact you</option>
            <option value="call" className="bg-[#0B1020]">Call Me</option>
            <option value="whatsapp" className="bg-[#0B1020]">WhatsApp</option>
            <option value="sms" className="bg-[#0B1020]">Text Message (SMS)</option>
          </select>
        </div>

        {/* Sticky Checkout Button */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0B1020]/90 backdrop-blur-md border-t border-white/10 p-4 z-50">
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] transition-all p-4 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.4)] flex justify-between items-center px-6"
          >
            <span>Book Now</span>
            <span>${finalTotal}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
