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
    // NEW: Unlisted Item Option
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

  // Handle Image Selection
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedServices.length === 0) {
      alert("Please select at least one item to assemble.");
      return;
    }

    setIsSubmitting(true);

    let redirected = false;

    // Send via Formspree using FormData (Supports Images)
    const triggerAction = async () => {
      const servicesList = selectedServices.map(s => `${s.label} x${s.qty}`).join(", ");
      
      const formData = new FormData();
      formData.append("Customer Name", form.name);
      formData.append("Phone Number", form.phone);
      formData.append("Service Date", form.date);
      formData.append("Total Price Estimations", hasCustomItem ? `Custom Quote Needed (+ $${finalTotal} for standard items)` : `$${finalTotal}`);
      formData.append("Items to Assemble", servicesList);
      formData.append("Full Address", `${form.address}, ${form.city} ${form.zip}`);
      formData.append("Additional Details", form.details || "None provided");

      if (imageFile) {
        formData.append("Item Picture", imageFile);
      }

      // Track Lead
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
            "Accept": "application/json"
          },
          body: formData
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

    // Google Ads Conversion tracking
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-18126644001/0yX5CL23q6QcEKHGusND',
        'value': finalTotal,
        'currency': 'USD',
        'transaction_id': Date.now().toString(), 
        'event_callback': () => {
          safeRedirect();
        }
      });

      // Fallback if gtag callback fails
      setTimeout(() => {
        if (!redirected) {
          safeRedirect();
        }
      }, 1000);
    } else {
      safeRedirect();
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
            Thank you, <span className="text-orange-400 font-bold">{form.name}</span>! We have received your assembly request. Our team will review the details and reach out shortly to confirm your appointment time.
          </p>
          <button onClick={() => setSubmitted(false)} className="mt-8 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-bold transition-all">← Book Another Service</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1020] text-white min-h-screen pb-32 font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0B1020]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex justify-between items-center shadow-lg">
        <div className="font-extrabold text-xl tracking-tight">Pro <span className="text-orange-500">Assembly</span></div>
        <a href={`tel:${myPhoneNumber}`} className="flex items-center gap-2 bg-orange-500/10 text-orange-400 px-5 py-2.5 rounded-full text-sm font-bold border border-orange-500/20 active:bg-orange-500/30 transition-all">
          <PhoneCall className="w-4 h-4" /> Call Now
        </a>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-orange-500/10 to-[#0B1020] pt-10 pb-8 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-green-500/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div> Available Today
        </div>
        <h1 className="text-4xl font-extrabold mb-4 leading-tight">Expert Furniture Assembly in DFW</h1>
        <p className="text-orange-400 font-bold text-lg mb-6">Fast. Insured. Stress-Free.</p>
        <button type="button" onClick={scrollToForm} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Get Free Quote</button>
      </div>

      {/* Work Gallery Section */}
      <div className="px-4 py-8">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-extrabold">Our Recent Work</h2>
          </div>
          <p className="text-white/60 text-sm">See why your neighbors trust us.</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {galleryImages.map((src, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-white/10 relative group bg-white/5 shadow-md">
              <img 
                src={src} 
                alt={`Pro Assembly Work Sample ${index + 1}`} 
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 pointer-events-none">
                <span className="text-orange-400 text-sm font-black uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-5 h-5" /> Done Right
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Section */}
      <div className="px-4 py-6 space-y-6 bg-white/5 mt-4">
        <div className="bg-[#0B1020] border border-white/10 p-6 rounded-2xl text-center shadow-lg">
          <div className="flex justify-center gap-1 mb-3 text-yellow-400">
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
            <Star className="w-5 h-5 fill-yellow-400" />
          </div>
          <p className="italic text-white/90 font-medium">"They built my bedroom set in 2 hours and took all the trash. Saved my weekend!"</p>
        </div>

        <div className="grid grid-cols-1 gap-4 px-2">
          <div className="flex items-center gap-4"><Package className="w-6 h-6 text-orange-400" /><span className="text-base font-semibold">Flat-pack & IKEA Experts</span></div>
          <div className="flex items-center gap-4"><ThumbsUp className="w-6 h-6 text-orange-400" /><span className="text-base font-semibold">100% Satisfaction Guarantee</span></div>
          <div className="flex items-center gap-4"><ShieldCheck className="w-6 h-6 text-orange-400" /><span className="text-base font-semibold">Fully Insured & Professional</span></div>
        </div>
      </div>

      <form id="booking-section" onSubmit={handleSubmit} className="pt-8">
        
        {/* Service Selection */}
        <div className="px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold">Select Your Items</h2>
            <p className="text-white/60 text-sm mt-1">Tap all the items you need assembled.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {services.map((s) => {
              const selected = selectedServices.find(x => x.label === s.label);
              const isCustom = s.label === "Item Not Listed";
              
              return (
                <div 
                  key={s.label} 
                  onClick={() => toggleService(s)} 
                  className={`p-4 rounded-2xl border-2 transition-all active:scale-95 text-center cursor-pointer shadow-sm ${
                    selected 
                    ? "bg-orange-500 border-orange-400 shadow-orange-500/20" 
                    : isCustom 
                      ? "bg-[#1E293B] border-blue-500/50 hover:bg-[#1E293B]/80"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <s.icon className={`mx-auto mb-3 w-7 h-7 ${selected ? "text-white" : isCustom ? "text-blue-400" : "text-white/50"}`} />
                  <div className={`text-xs font-bold uppercase mb-1 ${isCustom && !selected ? "text-blue-400" : ""}`}>{s.label}</div>
                  <div className={`font-black text-lg ${selected ? "text-white" : "text-orange-400"}`}>
                    {s.price > 0 ? `$${s.price}` : "Quote"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantities */}
        {selectedServices.length > 0 && (
          <div className="px-4 mt-6 space-y-3">
            {selectedServices.map((s) => (
              <div key={s.label} className="flex justify-between items-center bg-white/5 border border-white/10 p-4 rounded-xl shadow-inner">
                <div className="font-bold text-base">{s.label}</div>
                <div className="flex gap-6 items-center bg-[#0B1020] px-4 py-2 rounded-lg border border-white/5">
                  <button type="button" onClick={() => updateQty(s.label, s.qty - 1)} className="text-xl font-bold text-white/70 hover:text-white">-</button>
                  <span className="font-black text-base">{s.qty}</span>
                  <button type="button" onClick={() => updateQty(s.label, s.qty + 1)} className="text-xl font-bold text-white/70 hover:text-white">+</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Price Summary */}
        <div className="mx-4 mt-6 p-6 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl space-y-3 shadow-lg">
          <div className="flex justify-between text-sm font-semibold text-white/70"><span>Subtotal</span><span>${total}</span></div>
          {discount > 0 && <div className="flex justify-between text-sm font-bold text-green-400"><span>Multi-Item Discount</span><span>-{discount * 100}%</span></div>}
          <div className="flex justify-between text-sm font-semibold text-white/70"><span>Travel Fee</span><span>${travelFee}</span></div>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <span className="font-bold text-sm uppercase text-white/80">Estimated Total</span>
              <span className="text-orange-400 font-black text-4xl">${finalTotal}</span>
            </div>
            {hasCustomItem && (
              <span className="text-xs text-blue-400 text-right font-semibold">*Plus custom item quote</span>
            )}
          </div>
        </div>

        {/* Easy Fill Form Details */}
        <div className="p-4 mt-4">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-extrabold">Your Details</h2>
          </div>
          
          <div className="space-y-4">
            
            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-white/40" />
                </div>
                <input placeholder="Full Name" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none font-medium transition-all" onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <PhoneCall className="w-5 h-5 text-white/40" />
                </div>
                <input placeholder="Phone Number" required type="tel" className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none font-medium transition-all" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            {/* Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <MapPin className="w-5 h-5 text-white/40" />
              </div>
              <input placeholder="Street Address" required value={form.address} className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none font-medium transition-all" onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <button type="button" onClick={handleLocation} className="absolute right-2 top-2 text-orange-400 p-2 hover:bg-orange-400/20 bg-orange-400/10 rounded-lg transition-all" title="Use Current Location">
                <Locate className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input placeholder="City" required className="w-full p-4 bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none font-medium transition-all" onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input placeholder="ZIP Code" required type="number" className="w-full p-4 bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none font-medium transition-all" onChange={(e) => setForm({ ...form, zip: e.target.value })} />
            </div>

            {/* Date */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <CalendarDays className="w-5 h-5 text-white/40" />
              </div>
              <input type="date" required className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none font-bold text-white/90 transition-all [color-scheme:dark]" onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>

            {/* Image Upload Area */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-bold">Upload a Picture</h3>
              </div>
              <p className="text-xs text-white/60 mb-4 leading-relaxed">
                If you have an item that isn't listed, or just want to show us the box, snap a quick picture!
              </p>
              
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-white/80">Tap to upload a photo</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              ) : (
                <div className="relative w-full rounded-xl overflow-hidden border border-white/20 bg-black">
                  <img src={imagePreview} alt="Item Preview" className="w-full h-48 object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" /> Photo attached
                    </span>
                  </div>
                  <button type="button" onClick={removeImage} className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg text-xs font-bold shadow-lg transition-all">
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="relative mt-2">
              <div className="absolute top-4 left-4 flex items-start pointer-events-none">
                <AlignLeft className="w-5 h-5 text-white/40" />
              </div>
              <textarea 
                placeholder={hasCustomItem ? "Please describe your custom/unlisted item here..." : "Any gate codes, parking instructions, or specific details?"} 
                value={form.details} 
                rows={3} 
                onChange={(e) => setForm({ ...form, details: e.target.value })} 
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-orange-500 focus:bg-white/10 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none resize-none font-medium transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 w-full bg-[#0B1020]/95 backdrop-blur-xl border-t border-white/10 p-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 active:scale-[0.98] transition-all p-5 rounded-2xl font-black text-xl flex justify-between items-center px-8 shadow-xl shadow-orange-500/20 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <span>{isSubmitting ? "SENDING..." : "BOOK NOW"}</span>
            <span className="bg-black/20 px-3 py-1.5 rounded-lg text-base border border-white/10">${finalTotal}{hasCustomItem ? '+' : ''}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
