import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  sector: z.string().min(1, 'Sector is required'),
  bedrooms: z.preprocess(val => Number(val), z.number().min(1, 'At least one bedroom is required')),
  bathrooms: z.preprocess(val => Number(val), z.number().min(1, 'At least one bathroom is required')),
  purchase_price: z.preprocess(val => Number(val), z.number().positive().optional()),
  monthly_rent_price: z.preprocess(val => Number(val), z.number().positive().optional()),
  images: z.any()
    .refine(files => files?.length > 0, 'At least one image is required.')
    .refine(files => files?.length <= 6, 'You can upload a maximum of 6 images.'),
  agreed_to_commission: z.boolean().refine(val => val === true, "You must agree to the commission terms."),
});

const AddHouseForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

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
      await api.post('/houses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('House listing created successfully! It is now pending approval.');
      navigate('/seller/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary-dark">List a New House</h2>
      
      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="font-bold">Title</label>
          <input {...register('title')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Description</label>
          <textarea {...register('description')} rows={4} className="w-full p-3 border-2 rounded-lg mt-1"></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="font-bold">Province</label>
          <input {...register('province')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">District</label>
          <input {...register('district')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Sector</label>
          <input {...register('sector')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.sector && <p className="text-red-500 text-xs mt-1">{errors.sector.message as string}</p>}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-bold">Bedrooms</label>
          <input type="number" {...register('bedrooms')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Bathrooms</label>
          <input type="number" {...register('bathrooms')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms.message as string}</p>}
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-bold">Purchase Price (USD)</label>
          <input type="number" {...register('purchase_price')} placeholder="Optional, for sales" className="w-full p-3 border-2 rounded-lg mt-1" />
        </div>
        <div>
          <label className="font-bold">Monthly Rent (USD)</label>
          <input type="number" {...register('monthly_rent_price')} placeholder="Optional, for rentals" className="w-full p-3 border-2 rounded-lg mt-1" />
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
        <label htmlFor="commission" className="text-sm text-gray-700">I agree to pay a 10% commission to the system owner if my product is successfully sold or rented.</label>
        {errors.agreed_to_commission && <p className="text-red-500 text-xs mt-1">{errors.agreed_to_commission.message as string}</p>}
      </div>

      <button type="submit" disabled={loading} className="w-full bg-accent-orange text-white font-bold py-3 rounded-lg uppercase">
        {loading ? 'Submitting...' : 'Submit for Approval'}
      </button>
    </form>
  );
};

export default AddHouseForm;
