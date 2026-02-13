import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { MapPin, Tag, Star, Search, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AccommodationsList = () => {
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    city: '',
    maxPrice: '',
  });

  const fetchAccommodations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.city) params.append('city', filters.city);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      
      const response = await api.get(`/accommodations?${params.toString()}`);
      setAccommodations(response.data.data);
    } catch (error) {
      console.error('Error fetching accommodations', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className=" min-h-screen pb-18 pt-39">
      {/* Premium Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden pt-35">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover"
            alt="Luxury Accommodation"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/60 via-primary-dark/80 to-primary-dark/90"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >

            <span className="inline-block mb-2 bg-accent-orange text-white text-sm font-black uppercase tracking-[0.3em] px-8 py-4 rounded-full shadow-2xl shadow-accent-orange/20">
              PRIME REAL ESTATE & PREMIUM RENTALS
            </span>

            <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none">
              EXPLORE OUR <br />
              <span className="text-accent-orange">ACCOMMODATIONS</span>
            </h1>

            <p className="max-w-2xl -button-2 mx-auto text-gray-300 font-medium text-sm md:text-lg leading-relaxed">
              From luxury apartments in the heart of Kigali to exclusive event halls and boutique hotel rooms. Discover the perfect stay with Rivers Rwanda.
            </p>
          </motion.div>
        </div>

        {/* Integrated Filter Bar */}
        <div className="absolute -bottom-2 left-0 right-0 z-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{  duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto bg-white rounded-[2.5rem] shadow-2xl shadow-gray-900/20 p-4 flex flex-col md:flex-row items-center gap-4 border border-gray-100"
          >
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-orange-50 text-accent-orange rounded-2xl group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Location</span>
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleFilterChange}
                    className="w-full bg-transparent outline-none font-black text-primary-dark uppercase text-xs cursor-pointer"
                  >
                    <option value="">Where to?</option>
                    <option value="Kigali">Kigali</option>
                    <option value="Musanze">Musanze</option>
                    <option value="Rubavu">Rubavu</option>
                    <option value="Huye">Huye</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 group border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Property Type</span>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full bg-transparent outline-none font-black text-primary-dark uppercase text-xs cursor-pointer"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="hotel_room">Hotel Room</option>
                    <option value="event_hall">Event Hall</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 group border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-8">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform">
                  <Tag size={20} />
                </div>
                <div className="flex-1">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Budget</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max Price (Rwf)"
                    className="w-full bg-transparent outline-none font-black text-primary-dark uppercase text-xs placeholder:uppercase"
                  />
                </div>
              </div>

            </div>

            <button
              onClick={fetchAccommodations}
              className="bg-primary-dark text-white px-10 py-5 rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 hover:bg-accent-orange transition-all shadow-xl active:scale-95 w-full md:w-auto"
            >
              <Search size={18} strokeWidth={3} /> Search
            </button>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-40">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-[3rem] h-[500px] animate-pulse border border-gray-50 shadow-sm">
                <div className="bg-gray-100 h-72 rounded-t-[3rem]"></div>
                <div className="p-8 space-y-4">
                  <div className="h-6 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-12 bg-gray-100 rounded-2xl mt-8"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {accommodations.length > 0 ? (
              accommodations.map((item) => {
                const images = parseImages(item.images);
                const imageUrl = images[0] ? `http://localhost:5000${images[0]}` : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800';
                const price = item.price_per_night || item.price_per_event;

                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/40 overflow-hidden flex flex-col group border border-gray-100 hover:shadow-accent-orange/10 transition-all duration-500 h-full"
                  >
                    <div className="relative h-72 overflow-hidden p-3">
                      <div className="w-full h-full overflow-hidden rounded-[2.5rem]">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute top-8 left-8 bg-primary-dark/90 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-2 rounded-full border border-white/10 tracking-widest shadow-xl">
                        {item.type.replace('_', ' ')}
                      </div>
                       <div className="absolute bottom-8 right-8 p-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-accent-orange text-white px-6 py-3 rounded-2xl font-black text-sm shadow-2xl uppercase tracking-tighter">
                          Rwf {price?.toLocaleString()}
                          <span className="font-bold normal-case text-white/80 ml-1">/ night</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-8 pb-8 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-primary-dark uppercase tracking-tighter truncate">{item.name}</h3>
                        <div className="flex text-accent-orange gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="currentColor" />)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-text-light mb-8">
                        <MapPin size={16} className="text-accent-orange" />
                        <span className="text-[11px] font-black uppercase tracking-widest">{item.district}, {item.city}</span>
                      </div>

                      <div className="mt-auto flex gap-4">
                        <Link
                          to={`/accommodations/${item.id}`}
                          className="flex-1 text-center py-4 border-2 border-primary-dark text-primary-dark font-black rounded-2xl hover:bg-primary-dark hover:text-white transition-all duration-500 uppercase text-[10px] tracking-widest"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/accommodations/${item.id}`}
                          className="flex-[2] text-center py-4 bg-accent-orange text-white font-black rounded-2xl hover:bg-primary-dark transition-all duration-500 uppercase text-[10px] tracking-widest shadow-xl shadow-accent-orange/20 active:scale-95"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[3rem] shadow-xl border border-gray-50">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 size={40} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No accommodations found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({type: '', city: '', maxPrice: ''})}
                  className="mt-6 bg-accent-orange text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-primary-dark transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AccommodationsList;
