import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Share2, Heart, ArrowLeft, ShieldCheck, Users, BedDouble, Bath, MapPin, Star, Wifi, Car, Calendar, Info, CheckCircle2 } from 'lucide-react';
import ImageGallery from '../../components/common/ImageGallery';

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/accommodations/${id}`);
        setItem(response.data.data);
      } catch (error) {
        toast.error('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const bookingResponse = await api.post('/bookings', {
        item_id: id,
        item_type: 'accommodation',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
      });

      const { bookingId } = bookingResponse.data.data;
      const paymentResponse = await api.post('/payments', { bookingId });

      toast.success('Redirecting to payment confirmation...');
      navigate(`/payment/confirm?paymentId=${paymentResponse.data.data.paymentId}&transactionRef=${paymentResponse.data.data.transactionReference}`);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start payment process.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const parseImages = (imagesData: any) => {
    if (!imagesData) return [];
    try {
      const parsed = typeof imagesData === 'string' ? JSON.parse(imagesData) : imagesData;
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  };

  const parseAmenities = (amenitiesData: any) => {
    if (!amenitiesData) return [];
    try {
      return typeof amenitiesData === 'string' ? JSON.parse(amenitiesData) : amenitiesData;
    } catch (e) { return []; }
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
  const amenities = parseAmenities(item.amenities);
  const price = item.price_per_night || item.price_per_event || item.price_for_sale;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-24 md:pt-32">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-light hover:text-accent-orange transition-colors font-bold uppercase text-[10px] tracking-[0.2em] bg-white px-6 py-2.5 rounded-xl shadow-sm border border-gray-100"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Back to Search
          </button>
          <div className="flex gap-4">
            <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-primary-dark hover:text-accent-orange transition-all"><Share2 size={18}/></button>
            <button className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-primary-dark hover:text-red-500 transition-all"><Heart size={18}/></button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-10"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl">
              <ImageGallery images={images} />
            </div>

            <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-gray-50 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-accent-orange/10 text-accent-orange px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent-orange/20">
                    {item.type.replace('_', ' ')}
                  </span>
                  <div className="flex text-accent-orange gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-primary-dark uppercase tracking-tighter leading-none">
                  {item.name}
                </h1>
                <div className="flex items-center gap-2 text-text-light font-bold text-sm uppercase tracking-wide">
                  <MapPin size={18} className="text-accent-orange" />
                  {item.street_address}, {item.district}, {item.city}
                </div>
              </div>

              {/* Specific Details Based on Type */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-gray-100">
                {item.type === 'apartment' && (
                  <>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <BedDouble size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Bedrooms</span>
                      <span className="text-lg font-black text-primary-dark">{item.bedrooms || 0}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Bath size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Bathrooms</span>
                      <span className="text-lg font-black text-primary-dark">{item.bathrooms || 0}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Users size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Guests</span>
                      <span className="text-lg font-black text-primary-dark">{item.max_guests || 0}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Wifi size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Wifi</span>
                      <span className="text-[10px] font-black text-primary-dark uppercase">Available</span>
                    </div>
                  </>
                )}

                {item.type === 'hotel_room' && (
                  <>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Info size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Hotel Type</span>
                      <span className="text-[10px] font-black text-primary-dark uppercase text-center">{item.hotel_details?.star_rating || 'Luxury'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <BedDouble size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Room Type</span>
                      <span className="text-[10px] font-black text-primary-dark uppercase">{item.room_type || 'Deluxe'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Users size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Capacity</span>
                      <span className="text-lg font-black text-primary-dark">{item.max_guests || 2}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Calendar size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Check-in</span>
                      <span className="text-[10px] font-black text-primary-dark uppercase">14:00 PM</span>
                    </div>
                  </>
                )}

                {item.type === 'event_hall' && (
                  <>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Users size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Capacity</span>
                      <span className="text-lg font-black text-primary-dark">{item.capacity || 0}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Car size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Parking</span>
                      <span className="text-[10px] font-black text-primary-dark uppercase">Large Space</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Wifi size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Audio/Visual</span>
                      <span className="text-[10px] font-black text-primary-dark uppercase">Ready</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-3xl">
                      <Calendar size={24} className="text-accent-orange" />
                      <span className="text-[10px] font-black uppercase text-gray-400">Booking</span>
                      <span className="text-[10px] font-black text-primary-dark uppercase">Flexible</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-primary-dark uppercase tracking-widest">About this property</h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {item.description || "Experience unparalleled luxury and comfort at this premium property. Located in a prime area, it offers top-notch amenities and exceptional service to make your stay memorable."}
                </p>
              </div>

              {amenities.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-primary-dark uppercase tracking-widest">What this place offers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {amenities.map((amenity: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-600 font-bold text-sm uppercase tracking-wide">
                        <CheckCircle2 size={18} className="text-accent-orange" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-primary-dark text-white rounded-[3.5rem] shadow-2xl p-10 md:p-14 border border-white/5">
              <div className="space-y-10">
                <div className="text-center space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Total Price</span>
                  <div className="text-6xl font-black text-accent-orange tracking-tighter">
                    ${price?.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-bold uppercase text-gray-300 tracking-widest">
                    {item.price_per_night ? 'per night' : item.price_per_event ? 'per event' : 'full price'}
                  </span>
                </div>

                <div className="space-y-4">
                   {item.type === 'event_hall' ? (
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Perfect for</p>
                        <p className="text-sm font-black text-white uppercase tracking-wider">Weddings, Corporate Events, Parties</p>
                     </div>
                   ) : (
                     <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Availability</p>
                        <p className="text-sm font-black text-white uppercase tracking-wider">Instant Booking Available</p>
                     </div>
                   )}
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full bg-accent-orange text-white font-black py-6 rounded-3xl uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-primary-dark transition-all duration-500 shadow-2xl shadow-accent-orange/20 disabled:opacity-50 group flex items-center justify-center gap-3"
                >
                  {isProcessingPayment ? 'Processing...' : (
                    <>
                       {item.price_for_sale ? 'Buy Now' : 'Rent Now'}
                       <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <ShieldCheck size={16} className="text-accent-orange" />
                    Verified by Rivers Rwanda
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <CheckCircle2 size={16} className="text-accent-orange" />
                    Secure Payment Process
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetailPage;
