import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const CommissionManagement = () => {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/commissions');
      setCommissions(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch commissions');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleMarkAsPaid = async (commissionId: string) => {
    try {
      await api.patch(`/admin/commissions/${commissionId}/pay`);
      toast.success('Commission marked as paid!');
      fetchCommissions(); // Refresh the list
    } catch (error) {
      toast.error('Failed to update commission status');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Commission & Payout Management</h1>
      {loading ? (
        <p>Loading commissions...</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Seller Name</th>
                <th className="p-4 text-left">Seller Phone</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Earned At</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map(commission => (
                <tr key={commission.id} className="border-b">
                  <td className="p-4">{commission.first_name} {commission.last_name}</td>
                  <td className="p-4">{commission.phone_number}</td>
                  <td className="p-4 font-bold text-green-600">${parseFloat(commission.amount).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${{
                      pending: 'bg-yellow-200 text-yellow-800',
                      paid: 'bg-green-200 text-green-800',
                    }[commission.status] || 'bg-gray-200 text-gray-800'}`}>
                      {commission.status}
                    </span>
                  </td>
                  <td className="p-4">{new Date(commission.earned_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    {commission.status === 'pending' && (
                      <button onClick={() => handleMarkAsPaid(commission.id)} className="bg-blue-500 text-white px-3 py-1 rounded">
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommissionManagement;
