import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import logo from '../../assets/images/logo.png';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  nationalId: z.string().length(16, 'National ID must be 16 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SellerRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/sellers/register', data);
      toast.success(response.data.message);
      navigate(`/verify-otp?email=${data.email}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4 pt-24">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border">
        <div className="text-center mb-10">
          <img src={logo} alt="Rivers Rwanda Logo" className="mx-auto h-24 w-auto" />
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter mt-4">Become a Seller</h1>
          <p className="text-text-light font-medium mt-1">Join our platform and start selling.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input {...register('firstName')} placeholder="First Name" className="w-full p-4 border-2 rounded-xl outline-none" />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message as string}</p>}
            </div>
            <div>
              <input {...register('lastName')} placeholder="Last Name" className="w-full p-4 border-2 rounded-xl outline-none" />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message as string}</p>}
            </div>
          </div>

          <div>
            <input {...register('email')} placeholder="Email Address" className="w-full p-4 border-2 rounded-xl outline-none" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
          </div>
          
          <div>
            <input {...register('phoneNumber')} placeholder="Phone Number" className="w-full p-4 border-2 rounded-xl outline-none" />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message as string}</p>}
          </div>

          <div>
            <input {...register('nationalId')} placeholder="National ID (16 digits)" className="w-full p-4 border-2 rounded-xl outline-none" />
            {errors.nationalId && <p className="text-red-500 text-xs mt-1">{errors.nationalId.message as string}</p>}
          </div>

          <div>
            <input {...register('password')} type="password" placeholder="Password" className="w-full p-4 border-2 rounded-xl outline-none" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-accent-orange text-white font-bold py-4 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2">
            {loading ? 'Registering...' : 'Register'} <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already a seller? <Link to="/login" className="font-bold text-accent-orange">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SellerRegister;
