import { Router } from 'express';
import { 
  getPendingAgents, 
  approveAgent, 
  rejectAgent, 
  getAllBookings, 
  approveBooking, // Import the new function
  updateBookingStatus, 
  deleteBooking, 
  verifyBookingPayment, 
  getStats,
  getAllUsers,
  createAdminUser,
  updateUserRole,
  deleteUser,
  getAllSellers,
  approveSeller,
  rejectSeller,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  getAllCommissions, // New
  markCommissionAsPaid // New
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// All admin routes are protected and require admin role
router.use(authenticate, authorize('admin'));

router.get('/stats', getStats);

// User Management
router.get('/users', getAllUsers);
router.post('/users', createAdminUser);
router.patch('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

// Agent Management
router.get('/agents/pending', getPendingAgents);
router.patch('/agents/:id/approve', approveAgent);
router.patch('/agents/:id/reject', rejectAgent);

// Seller Management
router.get('/sellers', getAllSellers);
router.patch('/sellers/:id/approve', approveSeller);
router.patch('/sellers/:id/reject', rejectSeller);

// Product Management
router.get('/products/pending', getPendingProducts);
router.patch('/products/:type/:id/approve', approveProduct);
router.patch('/products/:type/:id/reject', rejectProduct);

// Booking & Payment Management
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/approve', approveBooking);
router.patch('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);
router.patch('/bookings/:bookingId/verify-payment', verifyBookingPayment);

// Commission & Payout Management
router.get('/commissions', getAllCommissions);
router.patch('/commissions/:id/pay', markCommissionAsPaid);

export default router;
