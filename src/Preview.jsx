import {
  Drill, Hammer, Wrench, Tv, Armchair, Dumbbell,
  Calendar, Locate, ShieldCheck, Star, CheckCircle2,
  PhoneCall, ThumbsUp, Package, Camera, UploadCloud
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
  const [submitted, setSubmitted] = useState(false); 
  const [debugLog, setDebugLog] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

  // 📸 Work Gallery Images
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

    setIsSubmitting(true);
    setDebugLog("⏳ Triggering Google Ads Conversion & Formspree...");

    let redirected = false;

    // ✅ Formspree API Integration + Meta Pixel + Cloudinary
    const triggerAction = async () => {
      let imageUrl = "No image uploaded";

      if (imageFile) {
        setDebugLog("📸 Uploading image to Cloudinary...");
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "pro assembl"); 

        try {
          const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dajjulqix/image/upload", {
            method: "POST",
            body: formData,
          });
          const cloudData = await cloudRes.json();
          imageUrl = cloudData.secure_url || "Upload failed";
        } catch (err) {
          console.error("Cloudinary upload failed", err);
          imageUrl = "Upload failed due to network error";
        }
      }

      const servicesList = selectedServices.map(s => `${s.label} x${s.qty}`).join(", ");
      
      const payload = {
        "Customer Name": form.name,
        "Phone Number": form.phone,
        "Service Date": form.date,
        "Total Price": `$${finalTotal}`,
        "Items to Assemble": servicesList,
        "Full Address": `${form.address}, ${form.city} ${form.zip}`,
        "Additional Details": form.details || "None provided",
        "Photo Link": imageUrl 
      };

      // 🔥 TRACK LEAD
      if (window.fbq) {
        window.fbq('track', 'Lead', {
          value: finalTotal,
          currency: 'USD'
        });
      }

      try {
        const response = await fetch("https://formspree.io/f/xkoyrkgl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          setSubmitted(true);
        } else {
          alert("There was an issue sending your request. Please try again or call us.");
        }
      } catch (error) {
        alert("There was an issue sending your request. Please try again or call us.");
      } finally {
        setIsSubmitting(false);
      }
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
      setDebugLog("⚠️ gtag not found - submitting directly");
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
          <h1 className="text-3xl font-black">Booking Received!</h1>
          <p className="text-white/60">Thank you, {form.name}! We have received your assembly request and will contact you shortly to confirm your appointment time.</p>
          <div className="p-3 bg-white/5 rounded text-xs font-mono text-green-400 border border-green-900">{debugLog}</div>
          <button onClick={() => { setSubmitted(false); removeImage(); }} className="text-orange-400 font-bold">← Book Another Service</button>
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

      {/* 📸 Work Gallery Section */}
      <div className="px-4 py-6">
        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-extrabold">Our Recent Work</h2>
          </div>
          <p className="text-white/60 text-sm">See why your neighbors trust us.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {galleryImages.map((src, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-white/10 relative group bg-white/5">
              <img 
                src={src} 
                alt={`Pro Assembly Work Sample ${index + 1}`} 
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 pointer-events-none">
                <span className="text-orange-400 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Done Right
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-4 py-6 space-y-6 bg-white/5 mt-4">
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
          
          {/* 📸 Added Photo Upload UI */}
          <div className="mt-4">
            <h3 className="text-sm font-bold mb-2 opacity-80">Upload a Photo (Optional)</h3>
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-all">
                <UploadCloud className="w-8 h-8 text-orange-400 mb-2" />
                <p className="text-xs font-semibold text-white/70">Tap to upload photo</p>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/20 w-full h-48">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500/90 text-white p-2 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm">Remove</button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0B1020]/95 backdrop-blur-lg border-t border-white/10 p-4 z-50">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.97] transition-all p-5 rounded-2xl font-black text-xl flex justify-between items-center px-8 shadow-xl shadow-orange-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>{isSubmitting ? "SENDING..." : "BOOK NOW"}</span>
            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">${finalTotal}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
