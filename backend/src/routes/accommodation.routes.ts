import { Router } from 'express';
import { 
  getAccommodations, 
  getAccommodation, 
  createAccommodation, 
  updateAccommodation, 
  deleteAccommodation 
} from '../controllers/accommodation.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadAccommodationImages } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getAccommodations);
router.get('/:id', getAccommodation);

// Seller and Admin routes
router.post('/', authenticate, authorize('seller', 'admin'), uploadAccommodationImages, createAccommodation);
router.patch('/:id', authenticate, authorize('seller', 'admin'), uploadAccommodationImages, updateAccommodation);
router.delete('/:id', authenticate, authorize('seller', 'admin'), deleteAccommodation);

export default router;
