import { Router } from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/contact.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/', submitInquiry);
router.get('/', authenticate, authorize('admin'), getInquiries);
router.patch('/:id/status', authenticate, authorize('admin'), updateInquiryStatus);

export default router;
