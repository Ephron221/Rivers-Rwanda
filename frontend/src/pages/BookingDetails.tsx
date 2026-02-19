import React from 'react';
import { useSearchParams } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const BookingDetails = () => {
  const [searchParams] = useSearchParams();

  // Extract data from URL
  const client = searchParams.get('client');
  const phone = searchParams.get('phone');
  const email = searchParams.get('email');
  const paymentMethod = searchParams.get('paymentMethod');
  const bookingDate = searchParams.get('bookingDate');
  const bookingRef = searchParams.get('bookingRef');

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border">
        <div className="text-center mb-8">
          <img src={logo} alt="Rivers Rwanda Logo" className="mx-auto h-24 w-auto mb-4" />
          <h1 className="text-3xl font-black text-primary-dark uppercase tracking-tighter">Booking Confirmation</h1>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Booking Reference</p>
            <p className="font-bold text-lg text-primary-dark">{bookingRef}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Client Name</p>
            <p className="font-bold text-lg text-primary-dark">{client}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Contact</p>
            <p className="font-bold text-lg text-primary-dark">{email} | {phone}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Booking Date</p>
              <p className="font-bold text-lg text-primary-dark">{bookingDate ? new Date(bookingDate).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-bold text-lg text-primary-dark">{paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
            <p className="text-xs text-gray-400">Scanned with Rivers Rwanda</p>
        </div>

      </div>
    </div>
  );
};

export default BookingDetails;
