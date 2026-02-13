import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Users, MapPin, Tag, Info, 
  Image as ImageIcon, X, Maximize2, 
  Share2, Heart, ShieldCheck, Star, 
  ArrowLeft, CheckCircle2, ChevronRight,
  Clock, ArrowRight, User
} from 'lucide-react';
import { addDays, format, isValid } from 'date-fns';

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    duration: '',
    customDays: '',
    guests: 1,
    requests: '',
    isAgent: false
  });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/accommodations/${id}`);
        setItem(response.data.data);
        if (user.email) {
            setBookingData(prev => ({
                ...prev,
                name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                email: user.email
            }));
        }
      } catch (error) {
        toast.error('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const parseImages = (imagesData: any) => {
    if (!imagesData) return [];
    try {
      return typeof imagesData === 'string' ? JSON.parse(imagesData) : imagesData;
    } catch (e) {
      return [];
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const getDaysCount = () => {
    if (bookingData.duration === 'custom') return parseInt(bookingData.customDays) || 0;
    return parseInt(bookingData.duration) || 0;
  };

  const calculateEndDate = () => {
    if (!bookingData.startDate || !bookingData.duration) return '';
    const daysCount = getDaysCount();
    if (daysCount <= 0) return '';
    const start = new Date(bookingData.startDate);
    if (!isValid(start)) return '';
    return format(addDays(start, daysCount), 'dd/MM/yyyy');
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!bookingData.name || !bookingData.email || !bookingData.phone) {
        toast.error('Please fill in all contact details');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingData.email)) {
        toast.error('Please enter a valid email');
        return false;
      }
    } else if (step === 2) {
      if (!bookingData.startDate || !bookingData.duration) {
        toast.error('Please select start date and duration');
        return false;
      }
      if (bookingData.duration === 'custom' && !bookingData.customDays) {
        toast.error('Please enter custom days');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    const daysCount = getDaysCount();
    if (daysCount <= 0) {
      toast.error('Please select a valid duration');
      return;
    }

    try {
      const priceVal = item.price_per_night || item.price_per_event;
      const totalAmount = priceVal * daysCount;
      const endDateVal = format(addDays(new Date(bookingData.startDate), daysCount), 'yyyy-MM-dd');

      await api.post('/bookings', {
        booking_type: 'accommodation',
        accommodation_id: id,
        start_date: bookingData.startDate,
        end_date: endDateVal,
        total_amount: totalAmount,
        special_requests: bookingData.requests,
        guests_count: bookingData.guests,
        booking_by: bookingData.isAgent ? 'agent' : 'self'
      });
      toast.success('Booking request sent successfully!');
      navigate('/client/bookings');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="h-12 w-12 border-4 border-accent-orange border-t-transparent rounded-full"
      />
    </div>
  );
  
  if (!item) return <div className="container mx-auto py-20 text-center text-primary-dark font-bold tracking-tighter uppercase">Accommodation not found</div>;

  const images = parseImages(item.images);
  const mainImage = images[0] ? `http://localhost:5000${images[0]}` : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200';
  const priceVal = item.price_per_night || item.price_per_event;
  const totalDays = getDaysCount();

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-24 md:pt-32">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-light hover:text-accent-orange transition-colors font-bold uppercase text-[10px] tracking-[0.2em] bg-white px-6 py-2.5 rounded-xl shadow-sm border border-gray-100"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </button>
          <div className="flex gap-3">
            <button onClick={handleShare} className="p-3 bg-white rounded-full text-text-light hover:text-accent-orange transition-all shadow-sm border border-gray-100">
              <Share2 size={18} />
            </button>
            <button onClick={() => setIsSaved(!isSaved)} className={`p-3 bg-white rounded-full transition-all shadow-sm border border-gray-100 ${isSaved ? 'text-red-500' : 'text-text-light hover:text-red-500'}`}>
              <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Image Premium Card */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-4 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative group"
            >
              <div 
                className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden rounded-[2.5rem] cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img 
                  src={mainImage} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt={item.name}
                />
                
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <span className="bg-primary-dark/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-5 py-2 rounded-full tracking-widest border border-white/10">
                    {item.type.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-2 bg-accent-orange text-white text-[10px] font-black uppercase px-5 py-2 rounded-full tracking-widest shadow-xl">
                    <Star size={12} fill="white" /> 4.9 Superhost
                  </div>
                </div>

                <div className="absolute bottom-8 right-8">
                  <button className="bg-white/95 backdrop-blur-md text-primary-dark px-6 py-3.5 rounded-2xl font-black text-[10px] tracking-widest uppercase flex items-center gap-2 hover:bg-accent-orange hover:text-white transition-all shadow-2xl">
                    <ImageIcon size={16} /> View {images.length || 1} Photos
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Tabs Navigation */}
            <div className="space-y-8 px-4">
              <div className="flex border-b border-gray-100 gap-10">
                {['overview', 'amenities', 'location'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-accent-orange' : 'text-gray-400 hover:text-primary-dark'}`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-bar" className="absolute bottom-0 left-0 w-full h-1 bg-accent-orange rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <h1 className="text-4xl font-black text-primary-dark tracking-tighter uppercase">{item.name}</h1>
                        <p className="text-text-light leading-relaxed font-medium">
                          {item.description || "Experience prime living in the heart of Kigali. This property combines modern luxury with authentic Rwandan hospitality."}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                           <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center text-center">
                              <Users className="text-accent-orange mb-2" size={24}/>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Capacity</span>
                              <span className="font-bold text-primary-dark text-sm">{item.max_guests || 4} Members</span>
                           </div>
                           <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center text-center">
                              <ShieldCheck className="text-accent-orange mb-2" size={24}/>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Verification</span>
                              <span className="font-bold text-primary-dark text-sm">Rivers Verified</span>
                           </div>
                           <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center text-center">
                              <MapPin className="text-accent-orange mb-2" size={24}/>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">District</span>
                              <span className="font-bold text-primary-dark text-sm">{item.district}</span>
                           </div>
                           <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex flex-col items-center text-center">
                              <Info className="text-accent-orange mb-2" size={24}/>
                              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</span>
                              <span className="font-bold text-primary-dark text-sm capitalize">{item.status}</span>
                           </div>
                        </div>
                      </div>
                    )}
                    {activeTab === 'amenities' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Fast WiFi', '24/7 Concierge', 'Secure Parking', 'Modern Kitchen', 'AC Rooms', 'Cleaning Service'].map((am, i) => (
                          <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-50 group hover:border-accent-orange transition-all">
                            <div className="p-2 bg-orange-50 text-accent-orange rounded-xl">
                              <CheckCircle2 size={18} />
                            </div>
                            <span className="font-bold text-primary-dark tracking-tight">{am}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeTab === 'location' && (
                      <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border-4 border-white shadow-xl relative group bg-gray-100">
                         <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="Map" />
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-primary-dark text-white p-5 rounded-full shadow-2xl animate-bounce">
                               <MapPin size={32} className="text-accent-orange" />
                            </div>
                         </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Side: High-End Interactive Multi-Step Booking Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/80 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-orange/5 rounded-full blur-3xl"></div>
              
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step}
                      className={`h-1.5 w-8 rounded-full transition-all duration-500 ${currentStep >= step ? 'bg-accent-orange w-12' : 'bg-gray-100'}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {currentStep} of 3</span>
              </div>

              {/* Price & Status Header (Always visible) */}
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary-dark tracking-tighter">Rwf {priceVal?.toLocaleString()}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">/ Day</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Status</span>
                  <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest border border-green-100 shadow-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Available
                  </span>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleBooking} className="relative z-10 min-h-[400px] flex flex-col">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6 flex-grow"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-4 text-gray-300" size={18} />
                          <input 
                            type="text" 
                            className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all placeholder:text-gray-300 shadow-inner"
                            placeholder="Your Name"
                            value={bookingData.name}
                            onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Email Address</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-4 text-gray-300" size={18} />
                          <input 
                            type="email" 
                            className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all placeholder:text-gray-300 shadow-inner"
                            placeholder="Your Email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Phone Number</label>
                        <div className="relative">
                          <Info className="absolute left-4 top-4 text-gray-300" size={18} />
                          <input 
                            type="text" 
                            className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all placeholder:text-gray-300 shadow-inner"
                            placeholder="Your Phone"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6 flex-grow"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Start Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-xs transition-all uppercase appearance-none shadow-inner"
                            value={bookingData.startDate}
                            onChange={(e) => setBookingData({...bookingData, startDate: e.target.value})}
                            required
                          />
                          <Calendar className="absolute right-4 top-4 text-gray-300 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Rental Duration</label>
                        <div className="relative">
                          <select 
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all appearance-none cursor-pointer shadow-inner"
                            value={bookingData.duration}
                            onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                            required
                          >
                            <option value="" disabled>Select Duration</option>
                            <option value="7">1 Week</option>
                            <option value="14">2 Weeks</option>
                            <option value="15">15 Days</option>
                            <option value="30">1 Month</option>
                            <option value="60">2 Months</option>
                            <option value="custom">Custom Duration</option>
                          </select>
                          <ChevronRight className="absolute right-4 top-4 text-gray-300 pointer-events-none rotate-90" size={16} />
                        </div>
                      </div>
                      {bookingData.duration === 'custom' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Custom Days</label>
                          <input 
                            type="number" 
                            className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm shadow-inner"
                            placeholder="Enter number of days"
                            value={bookingData.customDays}
                            onChange={(e) => setBookingData({...bookingData, customDays: e.target.value})}
                          />
                        </motion.div>
                      )}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">End Date</label>
                        <input 
                          type="text" 
                          readOnly
                          className="w-full p-4 bg-gray-100 border-2 border-transparent rounded-2xl outline-none font-bold text-sm text-gray-500 shadow-inner"
                          value={calculateEndDate()}
                          placeholder="End Date"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Total Guests</label>
                        <input 
                          type="number" 
                          min="1"
                          className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm shadow-inner"
                          value={bookingData.guests}
                          onChange={(e) => setBookingData({...bookingData, guests: parseInt(e.target.value) || 1})}
                        />
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="space-y-6 flex-grow"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] ml-2">Special Requests</label>
                        <textarea 
                          rows={4} 
                          className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all shadow-inner"
                          placeholder="Anything else?"
                          value={bookingData.requests}
                          onChange={(e) => setBookingData({...bookingData, requests: e.target.value})}
                        />
                      </div>

                      {/* Pricing Summary */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 p-5 rounded-[2rem] text-center shadow-inner">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Duration</p>
                          <p className="font-black text-primary-dark text-sm">{totalDays} Day(s)</p>
                        </div>
                        <div className="bg-gray-100 p-5 rounded-[2rem] text-center shadow-inner">
                          <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Price</p>
                          <p className="font-black text-primary-dark text-sm tracking-tighter">Rwf {(priceVal * totalDays).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-8 py-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="radio" 
                              name="book_type" 
                              checked={!bookingData.isAgent} 
                              onChange={() => setBookingData({...bookingData, isAgent: false})}
                              className="accent-accent-orange h-4 w-4"
                            />
                            <span className="text-[10px] font-black uppercase text-primary-dark group-hover:text-accent-orange transition-colors">Self</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input 
                              type="radio" 
                              name="book_type" 
                              checked={bookingData.isAgent} 
                              onChange={() => setBookingData({...bookingData, isAgent: true})}
                              className="accent-accent-orange h-4 w-4"
                            />
                            <span className="text-[10px] font-black uppercase text-primary-dark group-hover:text-accent-orange transition-colors">Agent</span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="mt-8 flex gap-4 pt-6 border-t border-gray-50">
                  {currentStep > 1 && (
                    <button 
                      type="button" 
                      onClick={handlePrev}
                      className="flex-1 bg-gray-100 text-primary-dark py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={14} /> Previous
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button 
                      type="button" 
                      onClick={handleNext}
                      className="flex-[2] bg-primary-dark text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent-orange transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      Next Step <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="flex-[2] bg-accent-orange text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary-dark transition-all shadow-xl shadow-accent-orange/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Confirm Booking
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 flex items-center justify-center gap-4 py-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default relative z-10">
                 <ShieldCheck size={18} />
                 <span className="text-[8px] font-black uppercase tracking-[0.4em]">Verified & Secure Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-white hover:text-accent-orange transition-colors p-2 bg-white/10 rounded-full">
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={mainImage} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AccommodationDetailPage;
