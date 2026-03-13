import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { BookOpen, Calendar, Eye, User } from 'lucide-react';
import { motion } from 'framer-motion';

const SellerBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/sellers/bookings');
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div></div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">Property Bookings</h1>
          <p className="text-text-light mt-1 font-medium">Manage and track bookings for your properties.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
          <BookOpen className="text-accent-orange" size={20} />
          <span className="text-sm font-black text-primary-dark uppercase tracking-widest">{bookings.length} Total</span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-text-light uppercase text-[10px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Booking Info & Dates</th>
                <th className="px-8 py-6">Client Details</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Earnings</th>
                <th className="px-8 py-6 text-center">Payment Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-sm">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-bold text-primary-dark uppercase tracking-tight">{b.booking_type.replace('_', ' ')}</p>
                    <p className="font-mono text-[10px] text-gray-400 mt-0.5">{b.booking_reference}</p>
                    <div className="mt-2 flex flex-col gap-1 text-[10px] font-bold uppercase tracking-tighter">
                      <div className="flex items-center gap-1.5 text-orange-600">
                        <Calendar size={12} /> Start: {formatDate(b.start_date)}
                      </div>
                      <div className="flex items-center gap-1.5 text-red-600">
                        <Calendar size={12} /> End: {formatDate(b.end_date)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-primary-dark">{b.client_name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{b.client_phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                        (b.booking_status === 'completed' || b.booking_status === 'confirmed') ? 'bg-green-100 text-green-700' :
                        b.booking_status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {b.booking_status}
                      </span>
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit ${
                        b.payment_status === 'paid' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'
                      }`}>
                        {b.payment_status === 'paid' ? 'PAYMENT RECEIVED' : 'WAITING PAYMENT'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-primary-dark">Rwf {(b.total_amount * 0.9).toLocaleString()}</span>
                      <span className="text-[9px] text-gray-400 uppercase font-black tracking-tighter">Your 90% Share</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {b.payment_proof_path ? (
                      <a href={`http://localhost:5000${b.payment_proof_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest text-primary-dark">
                        <Eye size={14} /> View
                      </a>
                    ) : (
                      <span className="text-[10px] text-gray-300 italic font-bold uppercase tracking-widest">No Proof</span>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-4 opacity-70">
                      <BookOpen size={48} />
                      <p className="font-bold">No bookings found for your properties.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerBookings;
