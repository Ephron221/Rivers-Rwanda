import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const schema = z.object({
  type: z.enum(['apartment', 'hotel_room', 'event_hall']),
  name: z.string().min(5, 'Name must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  price_per_night: z.preprocess(val => val ? Number(val) : undefined, z.number().positive().optional()),
  price_per_event: z.preprocess(val => val ? Number(val) : undefined, z.number().positive().optional()),
  images: z.instanceof(FileList)
    .refine(files => files?.length > 0, 'At least one image is required.')
    .refine(files => files?.length <= 6, 'You can upload a maximum of 6 images.'),
  agreed_to_commission: z.boolean().refine(val => val === true, "You must agree to the commission terms."),
}).refine(data => {
    if (data.type === 'event_hall') return !!data.price_per_event;
    return !!data.price_per_night;
}, {
    message: 'Price is required for the selected accommodation type',
    path: ['price_per_night'],
});

const AddAccommodationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: { type: 'apartment' } });
  const type = watch('type');

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
      await api.post('/accommodations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Accommodation created successfully! It is now pending approval.');
      navigate('/seller/products');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-primary-dark">List a New Accommodation</h2>

      {/* Accommodation Type */}
      <div>
        <label className="font-bold">Type</label>
        <select {...register('type')} className="w-full p-3 border-2 rounded-lg mt-1">
          <option value="apartment">Apartment</option>
          <option value="hotel_room">Hotel Room</option>
          <option value="event_hall">Event Hall</option>
        </select>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <div>
          <label className="font-bold">Name / Title</label>
          <input {...register('name')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">Description</label>
          <textarea {...register('description')} rows={4} className="w-full p-3 border-2 rounded-lg mt-1"></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message as string}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-bold">City</label>
          <input {...register('city')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
        </div>
        <div>
          <label className="font-bold">District</label>
          <input {...register('district')} className="w-full p-3 border-2 rounded-lg mt-1" />
          {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message as string}</p>}
        </div>
      </div>

      {/* Pricing */}
      {type === 'event_hall' ? (
        <div>
          <label className="font-bold">Price per Event (USD)</label>
          <input type="number" {...register('price_per_event')} className="w-full p-3 border-2 rounded-lg mt-1" />
           {errors.price_per_event && <p className="text-red-500 text-xs mt-1">{errors.price_per_event.message as string}</p>}
        </div>
      ) : (
        <div>
          <label className="font-bold">Price per Night (USD)</label>
          <input type="number" {...register('price_per_night')} className="w-full p-3 border-2 rounded-lg mt-1" />
           {errors.price_per_night && <p className="text-red-500 text-xs mt-1">{errors.price_per_night.message as string}</p>}
        </div>
      )}
      
      {/* Images */}
      <div>
        <label className="font-bold">Images (up to 6)</label>
        <Controller
            name="images"
            control={control}
            render={({ field }) => (
                <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={(e) => field.onChange(e.target.files)}
                    className="w-full p-3 border-2 rounded-lg mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-accent-orange hover:file:bg-orange-100"
                />
            )}
        />
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

export default AddAccommodationForm;
