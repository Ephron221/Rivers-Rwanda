import { useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=University+of+Lay+Adventists+of+Kigali`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <div className="bg-light-gray">
      {/* Header with animation */}
      <div className="bg-primary-dark pt-40 pb-24 text-center text-white overflow-hidden">
        <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="text-5xl font-extrabold uppercase tracking-tighter mb-2"
        >
            Contact Us
        </motion.h1>
        <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
            className="text-lg text-gray-300"
        >
            We're here to help. Reach out with any questions or inquiries.
        </motion.p>
      </div>

      <div className="container mx-auto px-4 -mt-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Map and Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-1 space-y-8"
          >
            {/* Google Map Section */}
            <motion.div variants={itemVariants} className="h-64 w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <iframe
                    title="Rivers Rwanda Location"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={mapUrl}
                    allowFullScreen
                ></iframe>
            </motion.div>

            {/* Contact Info Section */}
            <motion.div variants={itemVariants} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border transition-all hover:shadow-md hover:scale-105">
              <div className="p-3 bg-orange-50 text-accent-orange rounded-lg">
                <MapPin size={24}/>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Our Office</h3>
                <p className="text-text-light text-sm mt-1">University of Lay Adventists of Kigali, KK 508 St</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border transition-all hover:shadow-md hover:scale-105">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Phone size={24}/>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">Call Center</h3>
                <p className="text-text-light text-sm mt-1">+250 792 659 094</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border transition-all hover:shadow-md hover:scale-105">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <Mail size={24}/>
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-dark">General Inquiries</h3>
                <p className="text-text-light text-sm mt-1">info@rivers.com</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
            className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl border"
          >
            <h2 className="text-3xl font-bold text-primary-dark mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Full Name" className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange transition" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Email Address" className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange transition" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number (Optional)" className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange transition" />
                <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange bg-white transition">
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Booking Support">Booking Support</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Agent Partnership">Agent Partnership</option>
                </select>
              </div>
              <div>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="How can we help?" className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange transition"></textarea>
              </div>
              <div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-dark text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-lg"
                >
                  {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Send size={18}/> Send Message</>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
