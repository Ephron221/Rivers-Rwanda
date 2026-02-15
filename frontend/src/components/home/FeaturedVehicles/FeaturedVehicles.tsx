import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import { Star, Fuel, Settings, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturedVehicles = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await api.get('/vehicles?featured=true');
        setVehicles(response.data.data || []);
      } catch (error) {
        console.error('Error fetching featured vehicles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedVehicles();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-[3rem] h-[500px] animate-pulse">
            <div className="bg-gray-200 h-72 rounded-t-[3rem]"></div>
            <div className="p-8 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded-2xl mt-8"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  const parseImages = (imagesData: any) => {
    if (!imagesData) return [];
    try {
      return typeof imagesData === 'string' ? JSON.parse(imagesData) : imagesData;
    } catch (e) {
      return [];
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
    >
      {vehicles.map((car) => {
        const images = parseImages(car.images);
        const imageUrl = images[0] ? `http://localhost:5000${images[0]}` : 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800';
        const price = car.purpose === 'rent' ? car.daily_rate : car.sale_price;

        return (
          <motion.div 
            key={car.id} 
            variants={itemVariants}
            className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col group border border-gray-100 hover:shadow-2xl hover:shadow-accent-orange/10 transition-all duration-500 h-full"
          >
            <div className="relative h-72 overflow-hidden p-3">
              <div className="w-full h-full overflow-hidden rounded-[2.5rem]">
                <img 
                  src={imageUrl} 
                  alt={`${car.make} ${car.model}`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="absolute top-8 left-8 bg-primary-dark/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-2 rounded-full border border-white/10 tracking-widest">
                {car.year}
              </div>
              <div className="absolute bottom-8 right-8 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-accent-orange text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-2xl uppercase tracking-tighter">
                  Rwf {price?.toLocaleString()}
                  <span className="font-bold normal-case text-white/80 ml-1">{car.purpose === 'rent' && '/ day'}</span>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 flex-grow flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-black text-primary-dark uppercase tracking-tighter">{car.make} <span className="text-accent-orange font-mono">{car.model}</span></h3>
                <div className="flex text-accent-orange gap-0.5">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 my-6 border-y border-gray-50 py-6">
                {[ 
                  { icon: <Fuel size={18}/>, label: car.fuel_type }, 
                  { icon: <Settings size={18}/>, label: car.transmission }, 
                  { icon: <Gauge size={18}/>, label: car.vehicle_type } 
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col items-center gap-2 text-text-light ${i === 1 ? 'border-x border-gray-50' : ''}`}>
                    <div className="text-accent-orange">{item.icon}</div>
                    <span className="text-[9px] font-black uppercase tracking-widest truncate w-full text-center">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <Link 
                  to={`/cars/${car.id}`} 
                  className="w-full inline-block text-center py-5 bg-primary-dark text-white font-black rounded-2xl hover:bg-accent-orange transition-all duration-500 uppercase text-[10px] tracking-[0.3em] shadow-xl active:scale-95"
                >
                  View Vehicle Details
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default FeaturedVehicles;
