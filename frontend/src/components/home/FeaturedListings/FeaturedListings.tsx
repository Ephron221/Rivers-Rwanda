import { useEffect, useState } from 'react';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import { MapPin, Star, Tag, ChevronRight, Camera, X, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedListings = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await api.get('/accommodations');
        setFeatured(response.data.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching featured listings', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const parseImages = (imagesData: any) => {
    if (!imagesData) return [];
    try {
      if (typeof imagesData === 'string') return JSON.parse(imagesData);
      return imagesData;
    } catch (e) {
      return [];
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (loading) return (
    <div className="py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-3xl h-[400px] animate-pulse overflow-hidden shadow-sm">
          <div className="bg-gray-200 h-56 w-full"></div>
          <div className="p-5 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-20">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4 px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-accent-orange font-black text-[10px] uppercase tracking-widest">
            <span className="w-6 h-0.5 bg-accent-orange rounded-full"></span>
            Our Recommendations
          </div>
          <h2 className="text-3xl font-black text-primary-dark tracking-tighter uppercase leading-none">
            Featured <span className="text-accent-orange font-mono">Apartments</span>
          </h2>
        </div>
        <Link to="/accommodations" className="group flex items-center gap-2 text-primary-dark font-black uppercase text-[10px] tracking-widest hover:text-accent-orange transition-colors">
          Explore All
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
      >
        {featured.map((item) => {
          const images = parseImages(item.images);
          const imageUrl = images[0] ? `http://localhost:5000${images[0]}` : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800';
          const price = item.price_per_night || item.price_per_event;
          
          return (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-lg shadow-gray-200/40 overflow-hidden flex flex-col group border border-gray-100 hover:shadow-2xl hover:shadow-accent-orange/10 transition-all duration-500"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <img 
                  src={imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                   <button 
                    onClick={() => setSelectedImage(imageUrl)}
                    className="p-3 bg-white/90 backdrop-blur-md rounded-full text-primary-dark scale-75 group-hover:scale-100 transition-all duration-500 hover:bg-accent-orange hover:text-white shadow-xl"
                   >
                      <Maximize2 size={20} />
                   </button>
                </div>
                
                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <div className="bg-primary-dark/90 backdrop-blur-md text-white text-[8px] font-black uppercase px-2.5 py-1 rounded-full border border-white/10 tracking-widest">
                    {item.type}
                  </div>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 left-3 right-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-accent-orange text-white text-center py-2 rounded-xl font-black text-[10px] shadow-xl uppercase tracking-widest">
                    Rwf {price?.toLocaleString()}
                  </div>
                </div>

                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white border border-white/30 cursor-pointer hover:bg-white/40 transition-colors">
                    <Camera size={12} />
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-base font-extrabold text-primary-dark leading-tight line-clamp-1 mb-1 group-hover:text-accent-orange transition-colors">{item.name}</h3>

                <div className="flex items-center gap-1 text-text-light mb-3">
                  <MapPin size={12} className="text-accent-orange shrink-0" />
                  <span className="text-[10px] font-bold truncate opacity-70">{item.district}, {item.city}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-gray-50 mb-4">
                    <div className="flex items-center gap-1.5 text-text-light">
                        <Star size={12} className="text-accent-orange fill-accent-orange" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">4.8 Rating</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-light border-l border-gray-100 pl-2">
                        <Tag size={12} className="text-accent-orange" />
                        <span className="text-[9px] font-black uppercase tracking-tighter">Verified</span>
                    </div>
                </div>

                <div className="mt-auto">
                  <Link 
                    to={`/accommodations/${item.id}`} 
                    className="w-full inline-block text-center py-3 bg-gray-50 text-primary-dark font-black rounded-xl hover:bg-primary-dark hover:text-white transition-all duration-300 uppercase text-[9px] tracking-widest border border-gray-100 shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Full Screen Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-primary-dark/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-6 right-6 text-white hover:text-accent-orange transition-colors p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X size={40} strokeWidth={3} />
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-6xl w-full max-h-full overflow-hidden rounded-[2rem] shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Enlarged view" 
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedListings;
