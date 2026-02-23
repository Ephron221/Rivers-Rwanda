import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected routes for authenticated users
router.use(authenticate);

router.post('/', paymentController.initiatePayment);
router.post('/confirm', paymentController.confirmPayment);

export default router;
