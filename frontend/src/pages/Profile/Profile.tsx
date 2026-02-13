import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Camera, Save, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [imagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      const data = response.data.data;
      setProfile(data);
      setFormData({
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        phoneNumber: data.phone_number || ''
      });
      if (data.profile_image) {
        setProfileImagePreview(`http://localhost:5000${data.profile_image}`);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const data = new FormData();
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('phoneNumber', formData.phoneNumber);
      
      if (fileInputRef.current?.files?.[0]) {
        data.append('profile_image', fileInputRef.current.files[0]);
      }

      await api.patch('/users/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Profile updated successfully');
      fetchProfile();
      // Reload page to update header image/name
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pt-10 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-dark to-accent-orange opacity-90"></div>
        
        <div className="px-8 pb-12">
          {/* Profile Picture & Header */}
          <div className="relative -mt-16 flex flex-col md:flex-row items-end gap-6 mb-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl border-4 border-white bg-gray-100 shadow-xl overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <User size={48} />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-accent-orange text-white p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
              >
                <Camera size={16} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
              />
            </div>
            
            <div className="flex-grow pb-2">
              <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">
                {profile?.first_name ? `${profile.first_name} ${profile.last_name}` : 'User Profile'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-3 py-1 bg-orange-50 text-accent-orange text-[10px] font-black uppercase rounded-full tracking-widest border border-orange-100 shadow-sm">
                  {profile?.role} Account
                </span>
                {profile?.status === 'active' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-6 h-0.5 bg-accent-orange"></div>
                Personal Information
              </h2>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    name="firstName"
                    className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all shadow-inner"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    name="lastName"
                    className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all shadow-inner"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <div className="w-6 h-0.5 bg-accent-orange"></div>
                Contact Details
              </h2>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input 
                    type="email" 
                    className="w-full p-4 pl-12 bg-gray-100 border-2 border-transparent rounded-2xl outline-none font-bold text-sm text-gray-500 cursor-not-allowed"
                    value={profile?.email || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-4 text-gray-300" size={18} />
                  <input 
                    type="text" 
                    name="phoneNumber"
                    className="w-full p-4 pl-12 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-accent-orange focus:bg-white outline-none font-bold text-sm transition-all shadow-inner"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={updating}
                className="bg-primary-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent-orange transition-all duration-500 shadow-xl flex items-center gap-2"
              >
                {updating ? 'Updating...' : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Security Section (Coming Soon) */}
      <div className="mt-8 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary-dark uppercase text-xs tracking-widest">Security Settings</h3>
            <p className="text-xs text-text-light mt-1">Manage your password and session security.</p>
          </div>
        </div>
        <button className="text-accent-orange font-black text-[10px] uppercase tracking-widest hover:underline">Change Password</button>
      </div>
    </div>
  );
};

export default Profile;
