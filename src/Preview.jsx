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
      // ✅ Corrected Google Maps URL
      const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
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
      alert("Please select at least one item to build.");
      return;
    }

    if (!form.contactMethod) {
      alert("Please choose a contact method.");
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

Pricing Breakdown:
Subtotal: $${total}
Discount: ${discount * 100}%
Travel Fee: $${travelFee}
Final Total: $${finalTotal}

Location:
${form.address}
${form.city}, ${form.zip}

Date: ${form.date}
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
        <a href={`tel:${phoneNumber}`} className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm font-bold border border-orange-500/20 active:bg-orange-500/30 transition-all">
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
        <p className="text-orange-400 font-bold text-lg mb-4 underline decoration-orange-500/30 underline-offset-4">Fast. Insured. Stress-Free.</p>
        
        <p className="text-white/70 text-sm md:text-base max-w-md mx-auto mb-6 leading-relaxed">
          Forget the confusing manuals. Our expert technicians handle everything from IKEA sets to complex gym equipment with same-day availability.
        </p>

        <button 
          type="button"
          onClick={scrollToForm}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] w-full max-w-xs transition-all active:scale-95"
        >
          Get Free Quote
        </button>
      </div>

      {/* Trust & Benefits Section */}
      <div className="px-4 py-6 space-y-6 border-b border-white/10 bg-white/5">
        
        {/* Social Proof - Hardcoded Stars to avoid Map Error */}
        <div className="bg-[#0B1020] border border-white/10 p-5 rounded-xl text-center shadow-lg">
          <div className="flex justify-center gap-1 mb-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <p className="italic text-white/80 text-sm mb-2">"Saved my entire weekend! They arrived on time, built my entire bedroom set in 2 hours, and took all the trash."</p>
          <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">— Verified Local Customer</div>
        </div>

        {/* Benefits Bullet Points */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg"><Package className="w-5 h-5 text-orange-400" /></div>
            <span className="text-sm font-semibold">Flat-pack & IKEA Experts</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg"><ThumbsUp className="w-5 h-5 text-orange-400" /></div>
            <span className="text-sm font-semibold">100% Satisfaction Guarantee</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg"><ShieldCheck className="w-5 h-5 text-orange-400" /></div>
            <span className="text-sm font-semibold">Fully Insured & Professional</span>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-[#0B1020] p-6 rounded-xl border border-white/5">
          <h3 className="font-bold text-white mb-5 flex items-center gap-2 tracking-tight uppercase text-xs opacity-60">Simple Process</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <div>
                <div className="font-bold text-sm">Select Items</div>
                <div className="text-xs text-white/50">Choose what you need built below.</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <div>
                <div className="font-bold text-sm">Instant Quote</div>
                <div className="text-xs text-white/50">See your final price immediately.</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <div>
                <div className="font-bold text-sm">We Assemble</div>
                <div className="text-xs text-white/50">We arrive, build, and clean up.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Wrapper */}
      <form id="booking-section" onSubmit={handleSubmit} className="pt-4">
        
        {/* Services Selection */}
        <div className="p-4 pt-6">
          <h2 className="text-xl font-extrabold mb-1 tracking-tight">Select Items</h2>
          <p className="text-sm text-white/50 mb-6">Click to add items to your quote.</p>
          
          <div className="grid grid-cols-2 gap-3">
            {services.map((s) => {
              const selected = selectedServices.find(x => x.label === s.label);
              return (
                <div
                  key={s.label}
                  onClick={() => toggleService(s)}
                  className={`p-4 rounded-2xl border transition-all active:scale-95 text-center ${
                    selected 
                    ? "bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/20" 
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <s.icon className={`mx-auto mb-3 w-6 h-6 ${selected ? "text-white" : "text-white/40"}`} />
                  <div className="text-xs font-bold uppercase tracking-wide mb-1">{s.label}</div>
                  <div className={`font-black text-lg ${selected ? "text-white" : "text-orange-400"}`}>${s.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantities (Visible only when items are selected) */}
        {selectedServices.length > 0 && (
          <div className="px-4 space-y-2 animate-in fade-in slide-in-from-top-2">
            {selectedServices.map((s) => (
              <div key={s.label} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="font-bold text-sm">{s.label}</div>
                <div className="flex gap-5 items-center bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <button type="button" onClick={() => updateQty(s.label, s.qty - 1)} className="text-lg font-bold text-white/40 hover:text-white">-</button>
                  <span className="font-black text-sm">{s.qty}</span>
                  <button type="button" onClick={() => updateQty(s.label, s.qty + 1)} className="text-lg font-bold text-white/40 hover:text-white">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Breakdown */}
        <div className="m-4 p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/50">
            <span>Subtotal</span>
            <span>${total}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-xs font-bold text-green-400">
              <span>Multi-Item Discount</span>
              <span>-{discount * 100}%</span>
            </div>
          )}
          
          <div className="flex justify-between text-xs font-bold text-white/50">
            <span>Travel Fee</span>
            <span>${travelFee}</span>
          </div>
          
          <div className="pt-4 border-t border-white/10 flex justify-between items-end">
            <span className="font-bold text-sm uppercase opacity-60 mb-1">Estimated Total</span>
            <span className="text-orange-400 font-black text-3xl tracking-tighter">${finalTotal}</span>
          </div>
        </div>

        {/* Customer Info Section */}
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-extrabold mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-orange-500" />
            Contact Info
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" required className="w-full p-4 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-xl transition-all"
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Phone" required type="tel" className="w-full p-4 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-xl transition-all"
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <textarea
            placeholder="Special instructions (e.g. 3rd floor, tight spaces, brand name...)"
            value={form.details}
            rows={3}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            className="w-full p-4 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-xl transition-all resize-none"
          />

          <div className="relative">
            <input placeholder="Street Address" required value={form.address} className="w-full p-4 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-xl transition-all pr-12"
              onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button type="button" onClick={handleLocation} className="absolute right-3 top-3 text-orange-400 p-2 bg-orange-400/10 rounded-lg hover:bg-orange-400/20">
              <Locate className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" required className="p-4 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-xl transition-all"
              onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="ZIP" required type="number" className="p-4 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-xl transition-all"
              onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          </div>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-xl">
            <div className="pl-3 text-white/40"><Calendar className="w-5 h-5" /></div>
            <input type="date" required className="bg-transparent w-full p-3 outline-none text-white font-bold"
              onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>

          <select
            required
            value={form.contactMethod}
            onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}
            className="w-full p-4 bg-white/5 border border-white/10 focus:border-orange-500 outline-none rounded-xl font-bold appearance-none"
          >
            <option value="" disabled className="bg-[#0B1020]">How should we reach you?</option>
            <option value="call" className="bg-[#0B1020]">Call Me</option>
            <option value="whatsapp" className="bg-[#0B1020]">WhatsApp</option>
            <option value="sms" className="bg-[#0B1020]">Text Message (SMS)</option>
          </select>
        </div>

        {/* Sticky CTA Button */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0B1020]/95 backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all p-5 rounded-2xl font-black text-xl shadow-[0_-5px_30px_rgba(249,115,22,0.3)] flex justify-between items-center px-8"
          >
            <span>BOOK NOW</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">${finalTotal}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

        
