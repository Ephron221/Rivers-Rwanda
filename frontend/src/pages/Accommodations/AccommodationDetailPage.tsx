import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Share2, Heart, ArrowLeft, ShieldCheck } from 'lucide-react';
import ImageGallery from '../../components/common/ImageGallery';

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
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
      // First, create a booking to link the payment to
      const bookingResponse = await api.post('/bookings', {
        item_id: id,
        item_type: 'accommodation',
        start_date: new Date().toISOString().split('T')[0], // Placeholder, adjust as needed
        end_date: new Date().toISOString().split('T')[0], // Placeholder, adjust as needed
      });

      const { bookingId } = bookingResponse.data.data;

      // Second, initiate the payment for that booking
      const paymentResponse = await api.post('/payments', { bookingId });

      // Redirect to a dedicated payment page or show a modal
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
  const price = item.price_per_night || item.price_per_event;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 pt-24 md:pt-32">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-light hover:text-accent-orange transition-colors font-bold uppercase text-[10px] tracking-[0.2em] bg-white px-6 py-2.5 rounded-xl shadow-sm border border-gray-100"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Back
          </button>
          {/* Share/Save buttons can be added here */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-8"
          >
            <ImageGallery images={images} />
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <h2 className="font-bold text-2xl mb-4">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </motion.div>

          {/* Right Side: Payment Button */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-primary-dark text-white rounded-[3.5rem] shadow-2xl p-8 md:p-12">
              <div className="text-center">
                <p className="text-sm text-gray-300">Price</p>
                <p className="text-4xl font-bold text-accent-orange">${price}<span className="text-lg">/{item.price_per_night ? 'night' : 'event'}</span></p>
                <button 
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full mt-8 bg-accent-orange text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-primary-dark transition-all duration-500 shadow-xl disabled:opacity-50"
                >
                  {isProcessingPayment ? 'Processing...' : 'Rent Now'}
                </button>
                <p className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4"><ShieldCheck size={14}/> Secure Payment via System</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetailPage;
