import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { MessageSquare, Mail, Calendar, CheckCircle2, Clock, PlayCircle } from 'lucide-react';

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const response = await api.get('/contact');
      setInquiries(response.data.data);
    } catch (error) {
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      toast.success(`Inquiry marked as ${status.replace('_', ' ')}`);
      fetchInquiries();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-dark">Contact Inquiries</h1>
        <p className="text-text-light mt-1">Manage and respond to customer messages.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-text-light uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Sender Details</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        {inquiry.full_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-primary-dark">{inquiry.full_name}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Mail size={10} />
                          <span>{inquiry.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-text-dark">{inquiry.subject}</p>
                    <p className="text-xs text-text-light line-clamp-1 mt-0.5">{inquiry.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${
                      inquiry.status === 'new' ? 'bg-orange-100 text-orange-600' :
                      inquiry.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {inquiry.status === 'new' && <Clock size={10} />}
                      {inquiry.status === 'in_progress' && <PlayCircle size={10} />}
                      {inquiry.status === 'resolved' && <CheckCircle2 size={10} />}
                      {inquiry.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-text-light">
                      <Calendar size={12} className="text-gray-400" />
                      <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {inquiry.status === 'new' && (
                        <button 
                          onClick={() => handleStatusUpdate(inquiry.id, 'in_progress')} 
                          className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                        >
                          <PlayCircle size={12} /> Start
                        </button>
                      )}
                      {inquiry.status !== 'resolved' && (
                        <button 
                          onClick={() => handleStatusUpdate(inquiry.id, 'resolved')} 
                          className="bg-green-50 text-green-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle2 size={12} /> Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-light italic">No inquiries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InquiryManagement;
