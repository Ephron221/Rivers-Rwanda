import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, Users, Phone, Building, Home, HeartHandshake, BookKey, ArrowRight, MapPin } from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="bg-white text-text-dark">
      {/* Hero Section */}
      <section className="relative bg-primary-dark pt-40 pb-24 text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6164a83639?auto=format&fit=crop&q=80&w=2070" 
            alt="Modern Architecture" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-accent-orange text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6 shadow-xl">
              ABOUT US
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 uppercase">
              Your Trusted Gateway to <br />
              <span className="text-accent-orange">Comfort & Style</span>
            </h1>
            <p className="max-w-3xl mx-auto text-base md:text-lg text-gray-300 leading-relaxed">
              At Rivers Rwanda, we make finding the perfect place to stay or celebrate easy, secure, and enjoyable. We bring it all together in one seamless platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="py-24 container mx-auto px-4">

        {/* Mission Section */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-primary-dark tracking-tighter uppercase">Our Mission</h2>
            <p className="text-2xl font-bold text-text-light leading-snug italic border-l-4 border-accent-orange pl-6">
              "We connect travelers and event planners with reliable, beautiful, and affordable spaces across the region."
            </p>
            <p className="text-text-light leading-relaxed font-medium">
              We partner with trusted property owners and venue providers to offer you a wide range of carefully selected spaces that combine comfort, elegance, and affordability. With just a few clicks, you can explore, compare, and book the perfect space — wherever your journey takes you.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              {['Verified Properties', 'Easy Booking', 'Wedding Planning', '24/7 Support'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 font-bold text-primary-dark text-sm">
                  <Check className="text-green-500" /> {item}
                </div>
              ))}
            </div>
          </div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
          >
            <img src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Beautiful apartment" />
          </motion.div>
        </section>

        {/* Our Services Section */}
        <section className="mb-24 text-center">
          <div className="mb-12">
            <span className="text-accent-orange font-black text-[10px] uppercase tracking-widest">What We Offer</span>
            <h2 className="text-3xl font-black text-primary-dark tracking-tighter uppercase mt-1">Our Services</h2>
          </div>
          <motion.div 
            variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[ 
              { icon: <Building size={32}/>, title: 'Hotels', desc: 'Comfortable, stylish stays for every trip.' },
              { icon: <Home size={32}/>, title: 'Apartments & Houses', desc: 'Feel at home, even away from home.' },
              { icon: <HeartHandshake size={32}/>, title: 'Wedding Venues', desc: 'Celebrate love in the perfect setting.' },
              { icon: <BookKey size={32}/>, title: 'Secure Booking', desc: 'Easy, fast, and safe reservations.' }
            ].map((service, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="text-accent-orange mb-4 inline-block group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="font-bold text-primary-dark text-lg mb-2">{service.title}</h3>
                <p className="text-text-light text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-primary-dark text-white rounded-[3rem]">
          <div className="container mx-auto px-4 text-center">
            <div className="mb-12">
              <span className="text-accent-orange font-black text-[10px] uppercase tracking-widest">Why Choose Rivers Rwanda</span>
              <h2 className="text-3xl font-black tracking-tighter uppercase mt-1">The Benefits Of Working With Our Team</h2>
            </div>
            <motion.div 
              variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {[ 
                { icon: <Star />, title: 'Curated Listings', desc: 'We handpick every property to ensure quality and comfort.' },
                { icon: <Users />, title: 'Verified Hosts', desc: 'All our property owners are thoroughly vetted for your peace of mind.' },
                { icon: <Phone />, title: '24/7 Support', desc: 'Our customer service team is always available to assist you.' },
                { icon: <Check />, title: 'Transparent Pricing', desc: 'No hidden fees - you see the full price upfront.' },
                { icon: <ArrowRight />, title: 'Instant Booking', desc: 'Many properties allow immediate confirmation of your reservation.' },
                { icon: <MapPin />, title: 'Prime Locations', desc: 'Properties in the most convenient and desirable areas.' }
              ].map((benefit, i) => (
                <motion.div key={i} variants={itemVariants} className="bg-white/5 p-8 rounded-3xl border border-white/10 text-left">
                  <div className="flex items-center gap-4">
                    <div className="text-accent-orange">{benefit.icon}</div>
                    <h3 className="font-bold text-white text-lg">{benefit.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm mt-3 ml-10">{benefit.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
