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

// Admin only routes
router.post('/', authenticate, authorize('admin'), uploadAccommodationImages, createAccommodation);
router.patch('/:id', authenticate, authorize('admin'), uploadAccommodationImages, updateAccommodation);
router.delete('/:id', authenticate, authorize('admin'), deleteAccommodation);

export default router;
