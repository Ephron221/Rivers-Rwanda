import { Router } from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize('client'), createBooking);
router.get('/my', authenticate, authorize('client'), getMyBookings);
router.patch('/:id/cancel', authenticate, authorize('client'), cancelBooking);

export default router;
