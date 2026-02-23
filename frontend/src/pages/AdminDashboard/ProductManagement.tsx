import { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/products/pending');
      setProducts(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch pending products');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleApproval = async (productType: string, productId: string, action: 'approve' | 'reject') => {
    try {
      await api.patch(`/admin/products/${productType}/${productId}/${action}`);
      toast.success(`Product ${action}d successfully!`);
      fetchProducts(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to ${action} product`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Product Approval</h1>
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products are currently pending approval.</p>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created At</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={`${product.type}-${product.id}`} className="border-b">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4 capitalize">{product.type.replace('_', ' ')}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800">
                      Pending Approval
                    </span>
                  </td>
                  <td className="p-4">{new Date(product.created_at).toLocaleDateString()}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => handleApproval(product.type, product.id, 'approve')} className="bg-green-500 text-white px-3 py-1 rounded">Approve</button>
                    <button onClick={() => handleApproval(product.type, product.id, 'reject')} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
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

export default ProductManagement;
