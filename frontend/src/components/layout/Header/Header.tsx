import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import logo from '../../../assets/images/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Basic hooks for scroll and profile fetching
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await api.get('/users/profile');
          setProfile(response.data.data);
        } catch (error) {
          if ((error as any).response?.status === 401) handleLogout(true);
        }
      }
    };
    fetchProfile();
  }, [token, location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const handleLogout = (silent = false) => {
    localStorage.clear();
    setProfile(null);
    if (!silent) navigate('/login');
  };
  
  const handleDropdownToggle = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Accommodations', path: '/accommodations' },
    { name: 'Cars', path: '/cars', dropdown: [{ name: 'For Rent', path: '/cars?purpose=rent' }, { name: 'For Sale', path: '/cars?purpose=buy' }] },
    { name: 'Houses', path: '/houses', dropdown: [{ name: 'For Rent', path: '/houses?purpose=rent' }, { name: 'For Sale', path: '/houses?purpose=purchase' }] },
    { name: 'Contact', path: '/contact' },
  ];

  const getDisplayName = () => profile?.first_name ? `${profile.first_name}`.toUpperCase() : profile?.email.split('@')[0].toUpperCase() || 'USER';
  const getProfileImage = () => profile?.profile_image ? `http://localhost:5000${profile.profile_image}` : null;

  const dropdownVariants = { hidden: { opacity: 0, y: -10, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-primary-dark' : 'bg-transparent'}`}>
      <div className={`transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        <div className="container mx-auto flex justify-between items-center px-4 h-20">
          <Link to="/"><img src={logo} alt="Rivers Rwanda" className="h-12" /></Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {navLinks.map((link) => (
                <li key={link.name} className="relative" ref={activeDropdown === link.name ? dropdownRef : null}>
                  <button 
                    onClick={() => link.dropdown ? handleDropdownToggle(link.name) : navigate(link.path!)}
                    className={`flex items-center gap-1.5 text-sm font-black uppercase tracking-widest transition-colors duration-300 ${location.pathname.startsWith(link.path) && link.path !== '/' ? 'text-accent-orange' : 'text-white hover:text-accent-orange'}`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={16} className={`transition-transform ${activeDropdown === link.name ? 'rotate-180' : ''}`} />}
                  </button>
                  <AnimatePresence>
                  {link.dropdown && activeDropdown === link.name && (
                    <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 bg-white rounded-xl shadow-2xl overflow-hidden border">
                      {link.dropdown.map(dLink => (
                        <Link key={dLink.name} to={dLink.path} className="block px-5 py-3 text-sm font-bold text-primary-dark hover:bg-gray-50 hover:text-accent-orange transition-colors">{dLink.name}</Link>
                      ))}
                    </motion.div>
                  )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
             <div className="hidden lg:block"> {token && profile ? (<Link to={`/${user.role}/dashboard`} className="flex items-center gap-3 pl-4 border-l border-white/10 ml-4"><div className="text-right"><p className="text-white font-bold text-xs uppercase tracking-wider">{getDisplayName()}</p><p className="text-accent-orange text-[10px] font-bold uppercase">Dashboard</p></div><img src={getProfileImage() || '/user-placeholder.png'} alt="Profile" className="w-10 h-10 rounded-full border-2 border-accent-orange object-cover" /></Link>) : (<div className="flex items-center gap-2 pl-4 border-l border-white/10 ml-4"><Link to="/login" className="text-white hover:text-accent-orange text-xs font-bold uppercase px-4 py-2">Login</Link><Link to="/register" className="bg-accent-orange text-white px-5 py-2.5 rounded-md font-black text-xs uppercase hover:bg-white hover:text-primary-dark shadow-lg">Register</Link></div>)}</div>
            <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 text-white"><Menu size={28} /></button>
          </div>
        </div>
      </div>
       {/* Mobile menu would also need updating to handle click-to-open submenus */}
    </header>
  );
};

export default Header;
