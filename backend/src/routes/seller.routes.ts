import { Router } from 'express';
import * as sellerController from '../controllers/seller.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', sellerController.registerSeller);
router.post('/verify-otp', sellerController.verifyOtp);

router.get('/products', authenticate, sellerController.getSellerProducts);

export default router;