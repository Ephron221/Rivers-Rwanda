import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/sellers/products');
        setProducts(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch products');
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    navigate('/seller/products/new');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <button 
          onClick={handleAddProduct}
          className="bg-accent-orange text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
        >
          <PlusCircle size={20} />
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-10">
          <p className="mb-4">You have not added any products yet.</p>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b">
                  <td className="p-4">{product.name}</td>
                  <td className="p-4 capitalize">{product.type.replace('_', ' ')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${{
                      pending_approval: 'bg-yellow-200 text-yellow-800',
                      available: 'bg-green-200 text-green-800',
                      rejected: 'bg-red-200 text-red-800',
                      rented: 'bg-blue-200 text-blue-800',
                      sold: 'bg-purple-200 text-purple-800',
                    }[product.status] || 'bg-gray-200 text-gray-800'}`}>
                      {product.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">{new Date(product.created_at).toLocaleDateString()}</td>
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
