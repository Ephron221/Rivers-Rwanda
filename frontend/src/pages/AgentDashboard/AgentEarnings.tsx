import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Wallet, Calendar, CheckCircle2, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const AgentEarnings = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await api.get('/agents/commissions');
        setCommissions(response.data.data || []);
      } catch (error) {
        console.error('Error fetching earnings', error);
        toast.error('Failed to load earnings data');
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div>
    </div>
  );

  const totalEarned = commissions.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.amount : 0), 0);
  const pendingPayout = commissions.reduce((acc, curr) => acc + (curr.status === 'approved' ? curr.amount : 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">Earnings & Commissions</h1>
          <p className="text-text-light mt-1 font-medium">Track your performance and payout history.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Paid</span>
            <span className="text-lg font-black text-green-600 tracking-tighter">Rwf {totalEarned.toLocaleString()}</span>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Payout</span>
            <span className="text-lg font-black text-accent-orange tracking-tighter">Rwf {pendingPayout.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-text-light uppercase text-[10px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6">Transaction Date</th>
                <th className="px-8 py-6">Commission Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Payout Date</th>
                <th className="px-8 py-6 text-center">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium">
              {commissions.map((comm, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={comm.id} 
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm text-primary-dark">
                      <Calendar size={14} className="text-gray-300" />
                      {new Date(comm.earned_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-primary-dark">Rwf {comm.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit ${
                      comm.status === 'paid' ? 'bg-green-50 text-green-600' :
                      comm.status === 'approved' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {comm.status === 'paid' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {comm.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-xs text-text-light">
                    {comm.paid_at ? new Date(comm.paid_at).toLocaleDateString() : (
                      <span className="italic opacity-50">Pending processing</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-2 bg-gray-50 text-gray-400 hover:text-accent-orange hover:bg-orange-50 rounded-xl transition-all">
                      <ArrowRight size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {commissions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <TrendingUp size={48} />
                      <p className="text-lg font-bold text-text-light italic tracking-tight">No commission history found.</p>
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

export default AgentEarnings;
