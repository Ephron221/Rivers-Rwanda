import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Tag, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    type: 'All Types',
    maxPrice: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.append('city', searchData.location);
    if (searchData.type && searchData.type !== 'All Types') params.append('type', searchData.type.toLowerCase());
    if (searchData.maxPrice) params.append('maxPrice', searchData.maxPrice);

    navigate(`/accommodations?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center text-white overflow-hidden pt-40">
      {/* Background with parallax effect or just high quality */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000"
          alt="Luxury Home"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/60 to-primary-dark/80"></div>
      </div>

      <div className="container relative z-20 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-accent-orange text-white text-[10px] md:text-xs font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 shadow-xl text-center">
            Prime Real Estate & Premium Rentals
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-none uppercase text-center">
            Explore Our <br />
            <span className="text-accent-orange">Accommodations</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-lg text-gray-200 font-medium mb-12 leading-relaxed px-4 text-center">
            From luxury apartments in the heart of Kigali to exclusive event halls and boutique hotel rooms. Discover the perfect stay with Rivers Rwanda.
          </p>
        </motion.div>

        {/* Dynamic Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto relative z-30"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-0 text-text-dark border border-white/20">
            <div className="flex-1 flex items-center px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-text" onClick={() => document.getElementById('hero-location')?.focus()}>
              <MapPin size={20} className="text-accent-orange shrink-0 mr-3 transition-transform group-hover:scale-110" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Location</label>
                <input
                  id="hero-location"
                  type="text"
                  placeholder="Where to?"
                  className="w-full focus:outline-none bg-transparent font-bold text-primary-dark placeholder:text-gray-300"
                  value={searchData.location}
                  onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="flex-1 flex items-center px-6 py-3 md:py-0 border-b md:border-b-0 md:border-r border-gray-100 group cursor-pointer" onClick={() => document.getElementById('hero-type')?.focus()}>
              <Tag size={20} className="text-accent-orange shrink-0 mr-3 transition-transform group-hover:scale-110" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Property Type</label>
                <select
                  id="hero-type"
                  className="w-full focus:outline-none bg-transparent font-bold text-primary-dark appearance-none cursor-pointer"
                  value={searchData.type}
                  onChange={(e) => setSearchData({...searchData, type: e.target.value})}
                >
                  <option value="All Types">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Hotel Room">Hotel Room</option>
                  <option value="Event Hall">Event Hall</option>
                </select>
              </div>
            </div>

            <div className="flex-1 flex items-center px-6 py-3 md:py-0 group cursor-text" onClick={() => document.getElementById('hero-budget')?.focus()}>
              <Banknote size={20} className="text-accent-orange shrink-0 mr-3 transition-transform group-hover:scale-110" />
              <div className="text-left w-full">
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Budget</label>
                <input
                  id="hero-budget"
                  type="number"
                  placeholder="Max (Rwf)"
                  className="w-full focus:outline-none bg-transparent font-bold text-primary-dark placeholder:text-gray-300"
                  value={searchData.maxPrice}
                  onChange={(e) => setSearchData({...searchData, maxPrice: e.target.value})}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="bg-primary-dark text-white font-black px-10 py-5 rounded-xl md:rounded-full flex items-center justify-center gap-3 hover:bg-accent-orange transition-all duration-300 shadow-xl group active:scale-95"
            >
              <Search size={20} className="group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-widest text-xs">Search</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-light-gray to-transparent z-10 pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
