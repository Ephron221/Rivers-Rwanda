import { Router } from 'express';
import { 
  getVehicles, 
  getVehicle, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle 
} from '../controllers/vehicle.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { uploadVehicleImages } from '../middleware/upload.middleware';

const router = Router();

router.get('/', getVehicles);
router.get('/:id', getVehicle);

// Admin only routes
router.post('/', authenticate, authorize('admin'), uploadVehicleImages, createVehicle);
router.patch('/:id', authenticate, authorize('admin'), uploadVehicleImages, updateVehicle);
router.delete('/:id', authenticate, authorize('admin'), deleteVehicle);

export default router;
