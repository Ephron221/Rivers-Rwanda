import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, Facebook, Twitter, Linkedin, Instagram, Youtube, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState<any>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await api.get('/users/profile');
          setProfile(response.data.data);
        } catch (error) {
          console.error('Error fetching profile', error);
        }
      }
    };
    fetchProfile();
  }, [token, location]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setProfile(null);
    navigate('/login');
  };

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/accommodations?query=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Accommodations', path: '/accommodations' },
    { name: 'Cars', path: '/cars' },
    { name: 'Contact', path: '/contact' },
  ];

  const getDisplayName = () => {
    if (!profile) return 'User';
    if (profile.first_name) return `${profile.first_name}`;
    return profile.email.split('@')[0];
  };

  const getProfileImage = () => {
    if (profile?.profile_image) {
      return `http://localhost:5000${profile.profile_image}`;
    }
    return null;
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
    exit: { opacity: 0, y: 20 }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className="w-full fixed top-0 z-50 transition-all duration-300">
      {/* Top Bar */}
      <div className={`bg-white py-2 border-b transition-all duration-300 hidden md:block ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
        <div className="container mx-auto flex justify-between items-center text-sm text-text-light px-4">
          <div className="flex items-center gap-6">
            <a href="mailto:info@riversrwanda.com" className="flex items-center gap-2 hover:text-accent-orange transition-colors cursor-pointer">
              <Mail size={14} className="text-accent-orange" />
              <span>info@riversrwanda.com</span>
            </a>
            <a href="tel:+250787855706" className="flex items-center gap-2 hover:text-accent-orange transition-colors cursor-pointer">
              <Phone size={14} className="text-accent-orange" />
              <span>+250 787855706</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-accent-orange">
            {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
              <a href="#" key={i} className="hover:text-primary-dark transition-colors"><Icon size={14} /></a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`py-4 transition-all duration-300 ${isScrolled ? 'bg-primary-dark shadow-xl py-3' : 'bg-primary-dark/95 shadow-md'}`}>
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-black text-accent-orange tracking-tighter uppercase">Rivers</span>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Rwanda</span>
          </Link>
          
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`relative text-xs font-bold uppercase tracking-widest transition-colors hover:text-accent-orange ${
                      location.pathname === link.path ? 'text-accent-orange' : 'text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-4">
              {token ? (
                <div className="flex items-center gap-4 text-white">
                  <Link to={`/${user.role}/dashboard`} className="flex items-center gap-2 hover:text-accent-orange transition-colors">
                    {getProfileImage() ? (
                      <img src={getProfileImage()!} alt="Profile" className="w-8 h-8 rounded-full border-2 border-accent-orange object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent-orange flex items-center justify-center text-white font-bold text-xs">
                        {getDisplayName()[0].toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-bold uppercase hidden xl:inline">{getDisplayName()}</span>
                  </Link>
                  <button onClick={handleLogout} className="bg-accent-orange text-white px-4 py-2 rounded font-black text-xs uppercase hover:bg-white hover:text-primary-dark transition-all shadow-lg">Logout</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-white hover:text-accent-orange text-xs font-bold uppercase px-2">Login</Link>
                  <Link to="/register" className="bg-accent-orange text-white px-5 py-2.5 rounded font-black text-xs uppercase hover:bg-white hover:text-primary-dark transition-all shadow-lg">Register</Link>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-accent-orange p-2 transition-colors border-l border-white/10 ml-2"
            >
              <Search size={20} />
            </button>

            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-white hover:text-accent-orange transition-colors">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
            <motion.div 
              variants={menuVariants} initial="hidden" animate="visible" exit="exit"
              className="lg:hidden fixed inset-0 bg-primary-dark z-[100] pt-[calc(theme(spacing.24)+theme(spacing.4))]"
            >
              <div className="container mx-auto px-4 flex justify-between items-center absolute top-4 left-0 right-0">
                 <Link to="/" className="flex items-center gap-1 group">
                    <span className="text-2xl font-black text-accent-orange tracking-tighter uppercase">Rivers</span>
                    <span className="text-2xl font-black text-white tracking-tighter uppercase">Rwanda</span>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
                    <X size={28} />
                </button>
              </div>
              
              <motion.ul variants={menuVariants} className="flex flex-col items-center justify-center h-full gap-y-8 -mt-12">
                  {navLinks.map((link) => (
                      <motion.li variants={menuItemVariants} key={link.path}>
                          <Link to={link.path} className="text-2xl font-black uppercase tracking-tighter text-white/80 hover:text-accent-orange transition-colors">{link.name}</Link>
                      </motion.li>
                  ))}

                  <motion.li variants={menuItemVariants} className="pt-8">
                    {token ? (
                      <div className="flex flex-col items-center gap-4 text-white">
                        <Link to={`/${user.role}/dashboard`} className="flex flex-col items-center gap-2">
                          {getProfileImage() ? (
                            <img src={getProfileImage()!} alt="Profile" className="w-16 h-16 rounded-full border-4 border-accent-orange object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-accent-orange flex items-center justify-center text-white font-bold text-2xl">
                              {getDisplayName()[0].toUpperCase()}
                            </div>
                          )}
                          <span className="text-lg font-bold uppercase mt-2">{getDisplayName()}</span>
                        </Link>
                        <button onClick={handleLogout} className="bg-accent-orange text-white px-8 py-3 rounded font-black text-sm uppercase hover:bg-white hover:text-primary-dark transition-all shadow-lg mt-4">Logout</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <Link to="/login" className="text-white hover:text-accent-orange text-lg font-bold uppercase px-6 py-2">Login</Link>
                        <Link to="/register" className="bg-accent-orange text-white px-8 py-4 rounded font-black text-lg uppercase hover:bg-white hover:text-primary-dark transition-all shadow-lg">Register</Link>
                      </div>
                    )}
                  </motion.li>
              </motion.ul>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-dark/98 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
          >
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-8 right-8 text-white hover:text-accent-orange transition-all">
              <X size={40} strokeWidth={3} />
            </button>
            <form onSubmit={handleGlobalSearch} className="w-full max-w-4xl text-center">
              <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12">Search <span className="text-accent-orange">Rivers Rwanda</span></h2>
              <div className="relative group">
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Type to search properties or cars..." 
                  className="w-full bg-transparent border-b-4 border-white/20 py-6 text-2xl md:text-4xl text-white focus:outline-none focus:border-accent-orange transition-all placeholder:text-white/20 font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-0 bottom-6 text-accent-orange hover:scale-110 transition-transform">
                  <Search size={40} strokeWidth={3} />
                </button>
              </div>
              <p className="text-white/40 mt-6 text-sm font-bold uppercase tracking-widest">Press Enter to Search</p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
