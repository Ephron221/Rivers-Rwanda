import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { Car, Plus, Edit2, Trash2, X, Upload } from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    purpose: 'rent',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vehicle_type: 'sedan',
    transmission: 'automatic',
    fuel_type: 'petrol',
    seating_capacity: 5,
    daily_rate: '',
    sale_price: '',
    status: 'available'
  });

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data.data);
    } catch (error) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(e.target.files);
    }
  };

  const handleEdit = (v: any) => {
    setCurrentId(v.id);
    setFormData({
      purpose: v.purpose,
      make: v.make,
      model: v.model,
      year: v.year,
      vehicle_type: v.vehicle_type,
      transmission: v.transmission,
      fuel_type: v.fuel_type,
      seating_capacity: v.seating_capacity,
      daily_rate: v.daily_rate || '',
      sale_price: v.sale_price || '',
      status: v.status
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('purpose', formData.purpose);
    data.append('make', formData.make);
    data.append('model', formData.model);
    data.append('year', formData.year.toString());
    data.append('vehicle_type', formData.vehicle_type);
    data.append('transmission', formData.transmission);
    data.append('fuel_type', formData.fuel_type);
    data.append('seating_capacity', formData.seating_capacity.toString());
    if (formData.daily_rate) data.append('daily_rate', formData.daily_rate);
    if (formData.sale_price) data.append('sale_price', formData.sale_price);
    data.append('status', formData.status);

    if (selectedImages) {
      for (let i = 0; i < selectedImages.length; i++) {
        data.append('images', selectedImages[i]);
      }
    }

    try {
      if (isEditing && currentId) {
        await api.patch(`/vehicles/${currentId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Vehicle updated');
      } else {
        await api.post('/vehicles', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Vehicle added');
      }
      
      setShowForm(false);
      setIsEditing(false);
      setCurrentId(null);
      setSelectedImages(null);
      fetchVehicles();
      setFormData({
        purpose: 'rent', make: '', model: '', year: new Date().getFullYear(),
        vehicle_type: 'sedan', transmission: 'automatic', fuel_type: 'petrol',
        seating_capacity: 5, daily_rate: '', sale_price: '', status: 'available'
      });
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this vehicle?')) {
      try {
        await api.delete(`/vehicles/${id}`);
        toast.success('Deleted');
        fetchVehicles();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const parseImages = (imagesData: any) => {
    if (!imagesData) return [];
    try {
      return typeof imagesData === 'string' ? JSON.parse(imagesData) : imagesData;
    } catch (e) {
      return [];
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-orange"></div>
    </div>
  );

  return (
    <div className="space-y-8">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary-dark">Manage Vehicles</h1>
          <p className="text-text-light mt-1">Add, update or remove vehicles from inventory.</p>
        </div>
        <button 
          onClick={() => { setShowForm(!showForm); setIsEditing(false); }}
          className="bg-accent-orange text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all shadow-lg"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'CLOSE FORM' : 'ADD VEHICLE'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-primary-dark mb-6 border-b pb-4">
            {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Purpose</label>
                <select 
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none transition-all"
                  value={formData.purpose} 
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                >
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Make</label>
                <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Model</label>
                <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Year</label>
                <input type="number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.vehicle_type} onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="van">Van</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Transmission</label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})}>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Daily Rate (Rwf)</label>
                <input type="number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.daily_rate} onChange={(e) => setFormData({...formData, daily_rate: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Sale Price (Rwf)</label>
                <input type="number" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.sale_price} onChange={(e) => setFormData({...formData, sale_price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent-orange outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase block">Upload Images</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-accent-orange transition-all cursor-pointer relative group">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center gap-2">
                  <div className="p-4 bg-gray-50 text-gray-400 group-hover:text-accent-orange transition-colors rounded-full">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium text-text-light">{selectedImages ? `${selectedImages.length} files selected` : 'Click to upload vehicle images'}</p>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary-dark text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-opacity-90 transition-all shadow-lg">
              {isEditing ? 'UPDATE VEHICLE' : 'SAVE VEHICLE'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-text-light uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Preview</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Price/Rate</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vehicles.map((v) => {
                const images = parseImages(v.images);
                const imageUrl = images[0] ? `http://localhost:5000${images[0]}` : 'https://via.placeholder.com/100x60?text=No+Img';
                const price = v.purpose === 'rent' ? v.daily_rate : v.sale_price;

                return (
                  <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-20 h-12 rounded-lg overflow-hidden border shadow-sm">
                        <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary-dark">{v.make} {v.model}</p>
                      <p className="text-xs text-text-light">{v.year} | {v.transmission}</p>
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-xs">{v.purpose}</td>
                    <td className="px-6 py-4 font-bold text-primary-dark whitespace-nowrap text-sm">
                      Rwf {price?.toLocaleString()} {v.purpose === 'rent' && '/ day'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        v.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(v)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(v.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
