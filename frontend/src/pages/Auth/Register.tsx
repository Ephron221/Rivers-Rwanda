import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Phone, UserPlus, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState<'client' | 'agent'>('client');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = role === 'client' ? '/auth/register/client' : '/auth/register/agent';
      await api.post(endpoint, formData);
      
      if (role === 'client') {
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        toast.success('Agent application submitted! Please wait for admin approval.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-primary-dark rounded-xl shadow-lg">
              <UserPlus className="h-8 w-8 text-accent-orange" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-primary-dark uppercase tracking-tight">
            Join <span className="text-accent-orange">Rivers</span> Rwanda
          </h2>
          <p className="mt-2 text-sm text-text-light font-medium uppercase tracking-widest">
            Create an account to get started
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              role === 'client' 
                ? 'bg-white text-primary-dark shadow-md' 
                : 'text-gray-500 hover:text-primary-dark'
            }`} 
            onClick={() => setRole('client')}
          >
            <User size={18} />
            I AM A CLIENT
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              role === 'agent' 
                ? 'bg-white text-primary-dark shadow-md' 
                : 'text-gray-500 hover:text-primary-dark'
            }`} 
            onClick={() => setRole('agent')}
          >
            <ShieldCheck size={18} />
            I AM AN AGENT
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-widest mb-1 ml-1">
                First Name
              </label>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-accent-orange focus:border-accent-orange text-sm"
                placeholder="John"
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-widest mb-1 ml-1">
                Last Name
              </label>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-accent-orange focus:border-accent-orange text-sm"
                placeholder="Doe"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-widest mb-1 ml-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-accent-orange focus:border-accent-orange text-sm"
                placeholder="example@riversrwanda.com"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-widest mb-1 ml-1">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Phone size={18} />
              </div>
              <input 
                type="text" 
                name="phoneNumber" 
                value={formData.phoneNumber} 
                onChange={handleChange} 
                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-accent-orange focus:border-accent-orange text-sm"
                placeholder="+250 ..."
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-primary-dark uppercase tracking-widest mb-1 ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-accent-orange focus:border-accent-orange text-sm"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              className="w-full bg-primary-dark text-white font-bold py-4 rounded-lg uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                role === 'client' ? 'CREATE ACCOUNT' : 'SUBMIT AGENT APPLICATION'
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-text-light font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-accent-orange hover:underline uppercase tracking-wide">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
