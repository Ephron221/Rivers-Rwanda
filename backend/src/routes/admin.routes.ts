import { Router } from 'express';
import { 
  getPendingAgents, 
  approveAgent, 
  rejectAgent, 
  getAllBookings, 
  updateBookingStatus, 
  deleteBooking, 
  verifyBookingPayment, // Corrected import name
  getStats,
  getAllUsers,
  createAdminUser,
  updateUserRole,
  deleteUser
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

// Booking Management
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.delete('/bookings/:id', deleteBooking);

// --- Corrected Route for Payment Verification ---
router.patch('/bookings/:bookingId/verify-payment', verifyBookingPayment);

export default router;
