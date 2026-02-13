import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Check, X, ShieldCheck, Mail, Phone, Briefcase } from 'lucide-react';

const AgentManagement = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const response = await api.get('/admin/agents/pending');
      setAgents(response.data.data);
    } catch (error) {
      toast.error('Failed to load pending agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleApproval = async (id: string, approve: boolean) => {
    try {
      const endpoint = approve ? `/admin/agents/${id}/approve` : `/admin/agents/${id}/reject`;
      await api.patch(endpoint);
      toast.success(approve ? 'Agent approved' : 'Agent rejected');
      fetchAgents();
    } catch (error) {
      toast.error('Action failed');
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
        <h1 className="text-3xl font-bold text-primary-dark">Agent Applications</h1>
        <p className="text-text-light mt-1">Review and approve new agent registrations.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-text-light uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Agent Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Business</th>
                <th className="px-6 py-4">Date Applied</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-accent-orange font-bold">
                        {agent.first_name[0]}{agent.last_name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-primary-dark">{agent.first_name} {agent.last_name}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">ID: {agent.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-text-light">
                      <Mail size={12} className="text-accent-orange" />
                      <span>{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-light">
                      <Phone size={12} className="text-accent-orange" />
                      <span>{agent.phone_number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-primary-dark">
                      <Briefcase size={14} className="text-gray-400" />
                      <span>{agent.business_name || 'Individual'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-light">
                    {new Date(agent.application_date || agent.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleApproval(agent.id, true)}
                        className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all shadow-sm"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => handleApproval(agent.id, false)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all shadow-sm"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-text-light italic">No pending applications</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;
