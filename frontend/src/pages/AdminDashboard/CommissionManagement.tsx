import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { DollarSign, CheckCircle, Clock, User, Phone, ArrowUpRight, Percent } from 'lucide-react';
import { motion } from 'framer-motion';

const CommissionManagement = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommissions = async () => {
    try {
      const response = await api.get('/admin/commissions');
      setCommissions(response.data.data);
    } catch (error) {
      toast.error('Failed to load commissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleMarkAsPaid = async (id: string) => {
    if (window.confirm('Mark this commission as paid? This action confirms the payout has been sent.')) {
      try {
        await api.patch(`/admin/commissions/${id}/pay`);
        toast.success('Commission marked as paid');
        fetchCommissions();
      } catch (error) {
        toast.error('Failed to update status');
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div>
    </div>
  );

  const totalUnpaid = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">Commission Management</h1>
          <p className="text-text-light mt-1 font-medium">Track system earnings and manage payouts for sellers and agents.</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-accent-orange text-white rounded-2xl shadow-lg shadow-accent-orange/20">
                <Clock size={24} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Pending Payouts</p>
                <p className="text-2xl font-black text-primary-dark">Rwf {totalUnpaid.toLocaleString()}</p>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recipient Info</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Recipient Role</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Commission Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Earned At</th>
                <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {commissions.length > 0 ? commissions.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-dark/5 flex items-center justify-center text-primary-dark">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-primary-dark text-sm uppercase tracking-tight">{c.first_name} {c.last_name}</p>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Phone size={10}/> {c.phone_number}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.agent_id ? 'text-purple-500' : 'text-blue-500'}`}>
                        {c.agent_id ? 'AGENT' : 'SELLER'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-primary-dark">Rwf {Number(c.amount).toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1"><Percent size={10}/> 10% Fee</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      c.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-400">
                    {new Date(c.earned_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      {c.status === 'pending' ? (
                        <button 
                          onClick={() => handleMarkAsPaid(c.id)}
                          className="bg-white border-2 border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm"
                        >
                          Mark as Paid <ArrowUpRight size={14} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                            <CheckCircle size={16} /> Completed
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">No commissions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CommissionManagement;
