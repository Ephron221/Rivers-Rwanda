import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { Tag, MapPin, Star, Gauge, Fuel, Settings, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CarsList = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    purpose: '',
    make: '',
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.purpose) params.append('purpose', filters.purpose);
      if (filters.make) params.append('make', filters.make);
      
      const response = await api.get(`/vehicles?${params.toString()}`);
      setCars(response.data.data);
    } catch (error) {
      console.error('Error fetching cars', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCars();
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    <div className="bg-light-gray min-h-screen pt-20">
      {/* Page Header with Hero Background */}
      <div className="relative bg-primary-dark/80 pt-60 pb-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Cars" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 via-primary-dark/80 to-primary-dark"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-4">Our Vehicles</h1>
            <div className="flex items-center justify-center gap-2 text-accent-orange">
              <span className="w-12 h-1 bg-accent-orange rounded-full"></span>
              <span className="text-sm font-black uppercase tracking-[0.3em]">Ride in Comfort & Style</span>
              <span className="w-12 h-1 bg-accent-orange rounded-full"></span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {/* Filter Bar */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-center border border-gray-100">
          <div className="flex-grow w-full">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-2 block">Filter by Purpose</label>
            <select 
              name="purpose" 
              value={filters.purpose} 
              onChange={handleFilterChange}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-primary-dark transition-all appearance-none"
            >
              <option value="">All Purposes</option>
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
            </select>
          </div>
          <div className="flex-grow w-full">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2 mb-2 block">Filter by Brand</label>
            <select 
              name="make" 
              value={filters.make} 
              onChange={handleFilterChange}
              className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-primary-dark transition-all appearance-none"
            >
              <option value="">All Makes</option>
              <option value="Toyota">Toyota</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="BMW">BMW</option>
              <option value="Range Rover">Range Rover</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {cars.length > 0 ? (
              cars.map((car) => {
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
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[3rem] shadow-xl border border-gray-50">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Car size={40} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No vehicles found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({purpose: '', make: ''})}
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

export default CarsList;
