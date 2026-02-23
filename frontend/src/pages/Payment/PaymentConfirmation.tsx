import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { CheckCircle, Loader } from 'lucide-react';

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('processing'); // processing, success, failed

  const paymentId = searchParams.get('paymentId');
  const transactionRef = searchParams.get('transactionRef');

  useEffect(() => {
    if (!paymentId || !transactionRef) {
      toast.error('Invalid payment details.');
      navigate('/');
      return;
    }

    const confirm = async () => {
      try {
        await api.post('/payments/confirm', { paymentId, transactionReference: transactionRef });
        setStatus('success');
        toast.success('Payment successful! Your booking is confirmed.');
        setTimeout(() => navigate('/client/bookings'), 3000);
      } catch (error) {
        setStatus('failed');
        toast.error('Payment failed. Please try again.');
      }
      setLoading(false);
    };

    // Simulate payment processing time
    setTimeout(confirm, 2000);
  }, [paymentId, transactionRef, navigate]);

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl text-center">
        {loading && (
          <>
            <Loader className="mx-auto text-accent-orange animate-spin" size={40} />
            <h1 className="text-2xl font-bold mt-4">Processing Payment...</h1>
          </>
        )}
        {!loading && status === 'success' && (
          <>
            <CheckCircle className="mx-auto text-green-500" size={40} />
            <h1 className="text-2xl font-bold mt-4">Payment Successful!</h1>
            <p className="mt-2">You will be redirected to your bookings shortly.</p>
          </>
        )}
        {!loading && status === 'failed' && (
          <>
            <h1 className="text-2xl font-bold mt-4">Payment Failed</h1>
            <button onClick={() => navigate('/')} className="mt-4 bg-accent-orange text-white py-2 px-4 rounded">
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation;
