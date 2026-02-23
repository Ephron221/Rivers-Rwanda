import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const SellerManagement = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/sellers');
      setSellers(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch sellers');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleApproval = async (sellerId: string, action: 'approve' | 'reject') => {
    try {
      await api.patch(`/admin/sellers/${sellerId}/${action}`);
      toast.success(`Seller ${action}d successfully!`);
      fetchSellers(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to ${action} seller`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Seller Management</h1>
      {loading ? (
        <p>Loading sellers...</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">National ID</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map(seller => (
                <tr key={seller.id} className="border-b">
                  <td className="p-4">{seller.first_name} {seller.last_name}</td>
                  <td className="p-4">{seller.email}</td>
                  <td className="p-4">{seller.phone_number}</td>
                  <td className="p-4">{seller.national_id}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${{
                      pending: 'bg-yellow-200 text-yellow-800',
                      approved: 'bg-green-200 text-green-800',
                      rejected: 'bg-red-200 text-red-800',
                    }[seller.status] || 'bg-gray-200 text-gray-800'}`}>
                      {seller.status}
                    </span>
                  </td>
                  <td className="p-4 space-x-2">
                    {seller.status === 'pending' && (
                      <>
                        <button onClick={() => handleApproval(seller.id, 'approve')} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                        <button onClick={() => handleApproval(seller.id, 'reject')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                      </>
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

export default SellerManagement;
