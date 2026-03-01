import { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { DollarSign, CheckCircle, Clock, User, Phone, ArrowUpRight, Percent, Trash2, Wallet, Briefcase, TrendingUp } from 'lucide-react';
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

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this commission record? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/commissions/${id}`);
        toast.success('Commission record deleted');
        fetchCommissions();
      } catch (error) {
        toast.error('Failed to delete commission');
      }
    }
  };

  // --- AUTOMATIC TOTALS CALCULATION ---
  const stats = useMemo(() => {
    return commissions.reduce((acc, curr) => {
        const amount = Number(curr.amount) || 0;
        
        // 1. Total System Revenue
        if (curr.commission_type === 'system') {
            acc.systemTotal += amount;
        }
        
        // 2. Total Agent Payouts
        if (curr.commission_type === 'agent') {
            acc.agentTotal += amount;
        }

        // 3. Total Pending (Unpaid)
        if (curr.status === 'pending') {
            acc.pendingTotal += amount;
        }

        return acc;
    }, { systemTotal: 0, agentTotal: 0, pendingTotal: 0 });
  }, [commissions]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div>
    </div>
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">Commission Management</h1>
          <p className="text-text-light mt-1 font-medium">Track system earnings and manage payouts for sellers and agents.</p>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6">
            <div className="p-4 bg-green-50 text-green-600 rounded-3xl shadow-sm">
                <TrendingUp size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">System Revenue (10%)</p>
                <p className="text-2xl font-black text-primary-dark">Rwf {stats.systemTotal.toLocaleString()}</p>
            </div>
        </div>

        <div className="bg-white border border-gray-100 p-8 rounded-[2.5rem] shadow-sm flex items-center gap-6">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-3xl shadow-sm">
                <Briefcase size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Agent Commissions (5%)</p>
                <p className="text-2xl font-black text-primary-dark">Rwf {stats.agentTotal.toLocaleString()}</p>
            </div>
        </div>

        <div className="bg-accent-orange p-8 rounded-[2.5rem] shadow-xl shadow-accent-orange/20 flex items-center gap-6 text-white">
            <div className="p-4 bg-white/20 text-white rounded-3xl shadow-inner">
                <Wallet size={28} />
            </div>
            <div>
                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Pending Payouts</p>
                <p className="text-2xl font-black">Rwf {stats.pendingTotal.toLocaleString()}</p>
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
                        <p className="font-bold text-primary-dark text-sm uppercase tracking-tight">{c.first_name || 'N/A'} {c.last_name || ''}</p>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Phone size={10}/> {c.phone_number || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${c.commission_type === 'agent' ? 'text-purple-500' : 'text-blue-500'}`}>
                        {c.commission_type === 'agent' ? 'AGENT' : 'SYSTEM'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-primary-dark">Rwf {Number(c.amount).toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1"><Percent size={10}/> {c.commission_type === 'agent' ? '5%' : '10%'} Fee</p>
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
                    <div className="flex justify-center gap-3">
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
                      
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm group-hover:opacity-100 opacity-60"
                        title="Delete record"
                      >
                        <Trash2 size={16} />
                      </button>
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
