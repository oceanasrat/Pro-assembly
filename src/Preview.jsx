import {
  Drill, Hammer, Wrench, Tv, Armchair, Dumbbell,
  Calendar, Locate, ShieldCheck, Star, CheckCircle2,
  PhoneCall, ThumbsUp, Package, Camera, UploadCloud,
  User, MapPin, CalendarDays, AlignLeft, Image as ImageIcon
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
    date: ""
  });

  const [selectedServices, setSelectedServices] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reinforce Meta Pixel PageView
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
    { icon: Package, label: "Item Not Listed", price: 0 }, 
  ];

  const galleryImages = [
    "/images/IMG_4648.jpeg",
    "/images/IMG_4659.jpeg",
    "/images/IMG_4660.jpeg",
    "/images/copy_849F51B3-7230-4FA3-A6B0-D4E816F0ED68.jpeg"
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const total = selectedServices.reduce((sum, s) => sum + s.price * s.qty, 0);
  const itemCount = selectedServices.reduce((sum, s) => sum + s.qty, 0);
  const hasCustomItem = selectedServices.some(s => s.label === "Item Not Listed");

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

  // Helper to convert image to text for Formspree Free Tier
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert("Please select at least one item to assemble.");
      return;
    }

    setIsSubmitting(true);

    const servicesList = selectedServices.map(s => `${s.label} x${s.qty}`).join(", ");
    const payload = {
      "Customer Name": form.name,
      "Phone Number": form.phone,
      "Service Date": form.date,
      "Total Price": hasCustomItem ? `Quote Needed (Base: $${finalTotal})` : `$${finalTotal}`,
      "Items": servicesList,
      "Address": `${form.address}, ${form.city} ${form.zip}`,
      "Details": form.details || "None"
    };

    // Convert image to string if it exists to bypass Free Tier file blocks
    if (imageFile) {
      try {
        payload["Image_Base64_Link"] = await convertToBase64(imageFile);
      } catch (err) {
        console.error("Image conversion failed", err);
      }
    }

    // Tracking
    if (window.fbq) { window.fbq('track', 'Lead', { value: finalTotal, currency: 'USD' }); }
    if (window.gtag) { window.gtag('event', 'conversion', { 'send_to': 'AW-18126644001/0yX5CL23q6QcEKHGusND', 'value': finalTotal, 'currency': 'USD' }); }

    try {
      const response = await fetch("https://formspree.io/f/xkoyrkgl", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Submission failed. Please call us directly!");
      }
    } catch (error) {
      alert("Error sending request. Please check your connection or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#0B1020] text-white min-h-screen flex items-center justify-center p-6 text-center">
        <div className="space-y-6 max-w-md">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-500">
            <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-black">Booking Received!</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Thank you, <span className="text-orange-400 font-bold">{form.name}</span>! We'll reach out shortly.
          </p>
          <button onClick={() => setSubmitted(false)} className="mt-8 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-all">← Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1020] text-white min-h-screen pb-32 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0B1020]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center shadow-lg">
        <div className="font-extrabold text-xl tracking-tight">Pro <span className="text-orange-500">Assembly</span></div>
        <a href={`tel:${myPhoneNumber}`} className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-5 py-2.5 rounded-full text-sm font-bold border border-orange-500/20 active:bg-orange-500/30">
          <PhoneCall className="w-4 h-4" /> Call Now
        </a>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-b from-orange-500/10 to-[#0B1020] pt-10 pb-8 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-green-500/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Available Today
        </div>
        <h1 className="text-4xl font-extrabold mb-4 leading-tight">Expert Furniture Assembly</h1>
        <p className="text-orange-400 font-bold text-lg mb-6">Fast. Insured. Stress-Free.</p>
        <button type="button" onClick={scrollToForm} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/20 transition-all">Get Free Quote</button>
      </div>

      {/* Work Gallery */}
      <div className="px-4 py-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-extrabold">Our Recent Work</h2>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {galleryImages.map((src, index) => (
            <img key={index} src={src} alt="Work Sample" className="w-full rounded-2xl border border-white/10 shadow-md" loading="lazy" />
          ))}
        </div>
      </div>

      {/* Trust Quote */}
      <div className="px-4 py-6 bg-white/5 mt-4">
        <div className="bg-[#0B1020] border border-white/10 p-6 rounded-2xl text-center shadow-lg">
          <div className="flex justify-center gap-1 mb-3 text-yellow-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400" />)}
          </div>
          <p className="italic text-white/90">"They built my bedroom set in 2 hours and took all the trash. Saved my weekend!"</p>
        </div>
      </div>

      <form id="booking-section" onSubmit={handleSubmit} className="pt-8">
        <div className="px-4">
          <h2 className="text-2xl font-extrabold text-center mb-6">Select Your Items</h2>
          <div className="grid grid-cols-2 gap-3">
            {services.map((s) => {
              const selected = selectedServices.find(x => x.label === s.label);
              return (
                <div 
                  key={s.label} 
                  onClick={() => toggleService(s)} 
                  className={`p-4 rounded-2xl border-2 transition-all active:scale-95 text-center cursor-pointer ${selected ? "bg-orange-500 border-orange-400" : "bg-white/5 border-white/10"}`}
                >
                  <s.icon className={`mx-auto mb-3 w-7 h-7 ${selected ? "text-white" : "text-white/50"}`} />
                  <div className="text-xs font-bold uppercase mb-1">{s.label}</div>
                  <div className="font-black text-lg">{s.price > 0 ? `$${s.price}` : "Quote"}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantities */}
        {selectedServices.length > 0 && (
          <div className="px-4 mt-6 space-y-3">
            {selectedServices.map((s) => (
              <div key={s.label} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl">
                <span className="font-bold">{s.label}</span>
                <div className="flex gap-6 items-center bg-[#0B1020] px-4 py-2 rounded-lg border border-white/5">
                  <button type="button" onClick={() => updateQty(s.label, s.qty - 1)} className="text-xl">-</button>
                  <span className="font-black">{s.qty}</span>
                  <button type="button" onClick={() => updateQty(s.label, s.qty + 1)} className="text-xl">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total Display */}
        <div className="mx-4 mt-6 p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl">
          <div className="flex justify-between items-end">
            <span className="font-bold text-sm uppercase opacity-70">Estimated Total</span>
            <span className="text-orange-400 font-black text-4xl">${finalTotal}</span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 mt-4 space-y-4">
          <h2 className="text-2xl font-extrabold flex items-center gap-2"><User className="w-6 h-6 text-orange-400" /> Your Details</h2>
          <input placeholder="Full Name" required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Phone Number" required type="tel" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          
          <div className="relative">
            <input placeholder="Address" required value={form.address} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none pr-12" onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <button type="button" onClick={handleLocation} className="absolute right-2 top-2 text-orange-400 p-2 bg-orange-400/10 rounded-lg"><Locate className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input placeholder="City" required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <input placeholder="ZIP" required type="number" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none" onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          </div>

          <input type="date" required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none font-bold [color-scheme:dark]" onChange={(e) => setForm({ ...form, date: e.target.value })} />

          {/* Image Upload */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3">Upload a Picture</h3>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 cursor-pointer">
                <UploadCloud className="w-8 h-8 text-orange-400 mb-2" />
                <p className="text-sm font-semibold">Tap to upload photo</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/20">
                <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-red-500 p-2 rounded-lg text-xs font-bold shadow-lg">Remove</button>
              </div>
            )}
          </div>

          <textarea 
            placeholder="Any extra details?" 
            value={form.details} 
            rows={3} 
            onChange={(e) => setForm({ ...form, details: e.target.value })} 
            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none resize-none" 
          />
        </div>

        {/* Submit Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0B1020]/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-orange-500 p-5 rounded-2xl font-black text-xl flex justify-between items-center px-8 shadow-xl active:scale-95 transition-all"
          >
            <span>{isSubmitting ? "SENDING..." : "BOOK NOW"}</span>
            <span className="bg-black/20 px-3 py-1.5 rounded-lg text-base border border-white/10">${finalTotal}{hasCustomItem ? '+' : ''}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
