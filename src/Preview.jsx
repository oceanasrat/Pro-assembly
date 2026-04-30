import {
  Drill, Hammer, Wrench, Tv, Armchair, Dumbbell,
  Calendar, Locate, ShieldCheck, Star, CheckCircle2,
  PhoneCall, ThumbsUp, Package
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const [submitted, setSubmitted] = useState(false); 
  const [debugLog, setDebugLog] = useState(""); 

  // ✅ FIX 3: PageView Reinforcement
  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewContent');
    }
  }, []);

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
      prev.map(s => s.label === label ? { ...s, qty: Math.max(1, qty) } : s)
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
  const myPhoneNumber = "12142519820";

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
      setForm(prev => ({ ...prev, address: prev.address ? `${prev.address} (GPS: ${link})` : link }));
    }, () => alert("Unable to get location."));
  };

  const scrollToForm = () => {
    document.getElementById("booking-section").scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert("Please select at least one item.");
      return;
    }
    if (!form.contactMethod) {
      alert("Please choose a contact method.");
      return;
    }

    setDebugLog("⏳ Triggering Google Ads Conversion...");

    let redirected = false;

    // ✅ FIX 1 & 2: Move Meta Events to REAL ACTION
    const triggerAction = () => {
      const servicesList = selectedServices.map(s => `${s.label} x${s.qty}`).join(", ");
      const isCallRequest = form.contactMethod === "call";

      const message = `${isCallRequest ? "📞 CALL REQUESTED:" : "📅 NEW BOOKING:"}
Name: ${form.name}
Phone: ${form.phone}
Items: ${servicesList}
Total: $${finalTotal}
Address: ${form.address}, ${form.city} ${form.zip}
Date: ${form.date}
Details: ${form.details || "None"}
${isCallRequest ? "\nPLEASE CALL ME TO CONFIRM!" : ""}`;

      // 🔥 TRACK LEAD (Fires only when user actually proceeds)
      if (window.fbq) {
        window.fbq('track', 'Lead', {
          value: finalTotal,
          currency: 'USD'
        });
      }

      if (form.contactMethod === "whatsapp") {
        // 🔥 TRACK CONTACT (Specific to WhatsApp)
        if (window.fbq) window.fbq('track', 'Contact');
        window.open(`https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
      } else if (form.contactMethod === "email") {
        window.location.href = `mailto:contact@proassembl.com?subject=New Booking from ${form.name}&body=${encodeURIComponent(message)}`;
      } else {
        // 🔥 TRACK CONTACT (Specific to SMS)
        if (window.fbq) window.fbq('track', 'Contact');
        window.location.href = `sms:${myPhoneNumber}?body=${encodeURIComponent(message)}`;
      }
      setSubmitted(true); 
    };

    const safeRedirect = () => {
      if (redirected) return;
      redirected = true;
      triggerAction();
    };

    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-18126644001/0yX5CL23q6QcEKHGusND',
        'value': finalTotal,
        'currency': 'USD',
        'transaction_id': Date.now().toString(), 
        'event_callback': () => {
          setDebugLog("✅ SUCCESS: Conversion Fired Live!");
          safeRedirect();
        }
      });

      setTimeout(() => {
        if (!redirected) {
          setDebugLog("⚠️ Fallback triggered (Callback slow)");
          safeRedirect();
        }
      }, 1200);
    } else {
      setDebugLog("⚠️ gtag not found - redirecting anyway");
      safeRedirect();
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#0B1020] text-white min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-black">Booking Initialized!</h1>
          <p className="text-white/60">Your {form.contactMethod} app should be opening now to confirm your appointment.</p>
          <div className="p-3 bg-white/5 rounded text-xs font-mono text-green-400 border border-green-900">{debugLog}</div>
          <button onClick={() => setSubmitted(false)} className="text-orange-400 font-bold">← Back to Site</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1020] text-white min-h-screen pb-32 font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0B1020]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center">
        <div className="font-extrabold text-xl tracking-tight">Pro <span className="text-orange-500">Assembly</span></div>
        <div className="flex items-center gap-2">
          {debugLog && <div className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded hidden md:block">{debugLog}</div>}
          <a href={`tel:${myPhoneNumber}`} className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm font-bold border border-orange-500/20 active:bg-orange-500/30">
            <PhoneCall className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-500/10 to-[#0B1020] pt-10 pb-8 px-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-green-500/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Available Today
        </div>
        <h1 className="text-3xl font-extrabold mb-3 leading-tight">Expert Furniture Assembly in Rowlett & DFW</h1>
        <p className="text-orange-400 font-bold text-lg mb-4">Fast. Insured. Stress-Free.</p>
        <button type="button" onClick={scrollToForm} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg active:scale-95 transition-all">Get Free Quote</button>
      </div>

      {/* Trust Section */}
      <div className="px-4 py-6 space-y-6 bg-white/5">
        <div className="bg-[#0B1020] border border-white/10 p-5 rounded-xl text-center">
          <div className="flex justify-center gap-1 mb-2 text-yellow-400">
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
          </div>
          <p className="italic text-white/80 text-sm">"They built my bedroom set in 2 hours and took all the trash. Saved my weekend!"</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3"><Package className="w-5 h-5 text-orange-400" /><span className="text-sm font-semibold">Flat-pack & IKEA Experts</span></div>
          <div className="flex items-center gap-3"><ThumbsUp className="w-5 h-5 text-orange-400" /><span className="text-sm font-semibold">100% Satisfaction Guarantee</span></div>
          <div className="flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-orange-400" /><span className="text-sm font-semibold">Fully Insured & Professional</span></div>
        </div>
      </div>

      <form id="booking-section" onSubmit={handleSubmit} className="pt-4">
        {/* Service Selection */}
        <div className="p-4 pt-6">
          <h2 className="text-xl font-extrabold mb-6">Select Your Items</h2>
          <div className="grid grid-cols-2 gap-3">
            {services.map((s) => {
              const selected = selectedServices.find(x => x.label === s.label);
              return (
                <div key={s.label} onClick={() => toggleService(s)} className={`p-4 rounded-2xl border transition-all active:scale-95 text-center ${selected ? "bg-orange-500 border-orange-400" : "bg-white/5 border-white/10"}`}>
                  <s.icon className={`mx-auto mb-3 w-6 h-6 ${selected ? "text-white" : "text-white/40"}`} />
                  <div className="text-xs font-bold uppercase mb-1">{s.label}</div>
                  <div className={`font-black text-lg ${selected ? "text-white" : "text-orange-400"}`}>${s.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantities */}
        {selectedServices.length > 0 && (
          <div className="px-4 space-y-2">
            {selectedServices.map((s) => (
              <div key={s.label} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="font-bold text-sm">{s.label}</div>
                <div className="flex gap-5 items-center bg-black/40 px-3 py-1.5 rounded-lg">
                  <button type="button" onClick={() => updateQty(s.label, s.qty - 1)} className="text-lg font-bold">-</button>
                  <span className="font-black text-sm">{s.qty}</span>
                  <button type="button" onClick={() => updateQty(s.label, s.qty + 1)} className="text-lg font-bold">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price Summary */}
        <div className="m-4 p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3">
          <div className="flex justify-between text-xs font-bold opacity-50"><span>Subtotal</span><span>${total}</span></div>
          {discount > 0 && <div className="flex justify-between text-xs font-bold text-green-400"><span>Multi-Item Discount</span><span>-{discount * 100}%</span></div>}
          <div className="flex justify-between text-xs font-bold opacity-50"><span>Travel Fee</span><span>${travelFee}</span></div>
          <div className="pt-4 border-t border-white/10 flex justify-between items-end">
            <span className="font-bold text-sm uppercase opacity-60">Estimated Total</span>
            <span className="text-orange-400 font-black text-3xl">${finalTotal}</span>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="p-4 space-y-4">
          <h2 className="text-lg font-extrabold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-orange-500" />Contact Details</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Name" required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Phone" required type="tel" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <textarea placeholder="Any specific details?" value={form.details} rows={3} onChange={(e) => setForm({ ...form, details: e.target.value })} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none resize-none" />
          <div className="relative">
            <input placeholder="Street Address" required value={form.address} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none pr-12" onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button type="button" onClick={handleLocation} className="absolute right-3 top-3 text-orange-400 p-2 bg-orange-400/10 rounded-lg"><Locate className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="City" required className="p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="ZIP" required type="number" className="p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          </div>
          <input type="date" required className="bg-white/5 border border-white/10 w-full p-4 rounded-xl outline-none font-bold" onChange={(e) => setForm({ ...form, date: e.target.value })} />
          
          <select required value={form.contactMethod} onChange={(e) => setForm({ ...form, contactMethod: e.target.value })} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-bold appearance-none outline-none text-orange-400">
            <option value="" disabled className="text-white">Preferred Contact Method</option>
            <option value="call" className="text-white">Call Me (I'll send you my info first)</option>
            <option value="whatsapp" className="text-white">WhatsApp</option>
            <option value="sms" className="text-white">Text Message (SMS)</option>
            <option value="email" className="text-white">Email (Best for Desktop PCs)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0B1020]/95 backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all p-5 rounded-2xl font-black text-xl flex justify-between items-center px-8 shadow-xl shadow-orange-500/20">
            <span>BOOK NOW</span><span className="bg-white/20 px-3 py-1 rounded-lg text-sm">${finalTotal}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
