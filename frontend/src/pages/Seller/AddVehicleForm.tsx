import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const schema = z.object({
  purpose: z.enum(['rent', 'buy']),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.preprocess(val => Number(val), z.number().min(1990, 'Year must be 1990 or newer')),
  vehicle_type: z.enum(['sedan', 'suv', 'truck', 'van', 'luxury', 'other']),
  transmission: z.enum(['automatic', 'manual']),
  fuel_type: z.enum(['petrol', 'diesel', 'electric', 'hybrid']),
  seating_capacity: z.preprocess(val => Number(val), z.number().min(1, 'Seating capacity is required')),
  daily_rate: z.preprocess(val => Number(val), z.number().positive().optional()),
  sale_price: z.preprocess(val => Number(val), z.number().positive().optional()),
  images: z.any()
    .refine(files => files?.length > 0, 'At least one image is required.')
    .refine(files => files?.length <= 6, 'You can upload a maximum of 6 images.'),
  agreed_to_commission: z.boolean().refine(val => val === true, "You must agree to the commission terms."),
});

const AddVehicleForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { purpose: 'rent', vehicle_type: 'sedan' } });

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images') {
        for (let i = 0; i < data.images.length; i++) {
          formData.append('images', data.images[i]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await api.post('/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Vehicle listing created successfully! It is now pending approval.');
      navigate('/seller/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary-dark">List a New Vehicle</h2>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-bold">Purpose</label>
          <select {...register('purpose')} className="w-full p-3 border-2 rounded-lg mt-1">
            <option value="rent">For Rent</option>
            <option value="buy">For Sale</option>
          </select>
        </div>
        <div>
          <label className="font-bold">Make</label>
          <input {...register('make')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.make && <p className="text-red-500 text-xs mt-1">{errors.make.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Model</label>
          <input {...register('model')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Year</label>
          <input type="number" {...register('year')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Vehicle Type</label>
          <select {...register('vehicle_type')} className="w-full p-3 border-2 rounded-lg mt-1">
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="luxury">Luxury</option>
            <option value="other">Other</option>
          </select>
          {errors.vehicle_type && <p className="text-red-500 text-xs mt-1">{errors.vehicle_type.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Transmission</label>
          <select {...register('transmission')} className="w-full p-3 border-2 rounded-lg mt-1">
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        </div>
        <div>
          <label className="font-bold">Fuel Type</label>
          <select {...register('fuel_type')} className="w-full p-3 border-2 rounded-lg mt-1">
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="font-bold">Seating Capacity</label>
          <input type="number" {...register('seating_capacity')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.seating_capacity && <p className="text-red-500 text-xs mt-1">{errors.seating_capacity.message as string}</p>}
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-bold">Sale Price (USD)</label>
          <input type="number" {...register('sale_price')} placeholder="Optional" className="w-full p-3 border-2 rounded-lg mt-1" />
        </div>
        <div>
          <label className="font-bold">Daily Rate (USD)</label>
          <input type="number" {...register('daily_rate')} placeholder="Optional" className="w-full p-3 border-2 rounded-lg mt-1" />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="font-bold">Images (up to 6)</label>
        <input type="file" {...register('images')} multiple accept="image/*" className="w-full p-3 border-2 rounded-lg mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-accent-orange hover:file:bg-orange-100" />
        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images.message as string}</p>}
      </div>

      {/* Commission Agreement */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register('agreed_to_commission')} id="commission" className="h-4 w-4 rounded"/>
        <label htmlFor="commission" className="text-sm text-gray-700">I agree to pay a 10% commission to the system owner.</label>
        {errors.agreed_to_commission && <p className="text-red-500 text-xs mt-1">{errors.agreed_to_commission.message as string}</p>}
      </div>

      <button type="submit" disabled={loading} className="w-full bg-accent-orange text-white font-bold py-3 rounded-lg uppercase">
        {loading ? 'Submitting...' : 'Submit for Approval'}
      </button>
    </form>
  );
};

export default AddVehicleForm;
