import { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', formData);
      toast.success('Your message has been sent!');
      setFormData({ fullName: '', email: '', phoneNumber: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light-gray">
      {/* Header */}
      <div className="bg-primary-dark pt-40 py-16 text-center text-white">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">Contact Us</h1>
        <p className="text-gray-300">We're here to help. Reach out with any questions or inquiries.</p>
      </div>

      <div className="container mx-auto px-4 -mt-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Section */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border">
              <div className="p-3 bg-orange-50 text-accent-orange rounded-lg">
                <MapPin size={24}/>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Our Office</h3>
                <p className="text-text-light text-sm mt-1">Kigali Heights, 4th Floor, Kigali</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Phone size={24}/>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Call Us</h3>
                <p className="text-text-light text-sm mt-1">+250 787 855 706</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <Mail size={24}/>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Email Us</h3>
                <p className="text-text-light text-sm mt-1">info@riversrwanda.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl border">
            <h2 className="text-2xl font-bold text-primary-dark mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange" />
                <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange bg-white">
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking Support">Booking Support</option>
                  <option value="Agent Partnership">Agent Partnership</option>
                </select>
              </div>
              <div>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="How can we help?" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange"></textarea>
              </div>
              <div>
                <button type="submit" disabled={loading} className="w-full bg-primary-dark text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400">
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Send size={18}/> Send Message</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
